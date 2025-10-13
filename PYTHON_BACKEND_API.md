# Python Backend API Documentation

This document outlines the required endpoints for your Python backend to integrate with the React frontend.

## Base URL
Configure in your `.env` file:
```
VITE_PYTHON_BACKEND_URL=http://localhost:8000/api
```

## Authentication Flow

### 1. Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "freelancer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "userId": "uuid",
  "role": "freelancer"
}
```

**Implementation Notes:**
- Hash passwords using bcrypt (min 10 rounds)
- Validate email format and password strength (min 8 chars, 1 number, 1 special char)
- Generate JWT token with 24-hour expiration
- Store user in database with role

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "userId": "uuid",
  "role": "freelancer"
}
```

**Implementation Notes:**
- Verify password against hashed version
- Rate limit: max 5 attempts per 15 minutes
- Return generic error: "Invalid email or password" (don't reveal which is wrong)
- Log failed attempts for security monitoring

---

## Profile Management

### 3. Evaluate Profile
**Endpoint:** `POST /profile/evaluate`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "bio": "Experienced full-stack developer...",
  "skills": ["React", "Python", "Node.js", "TypeScript"],
  "experience_years": 5,
  "hourly_rate": 75.00,
  "portfolio_url": "https://portfolio.com",
  "linkedin_url": "https://linkedin.com/in/username",
  "github_url": "https://github.com/username"
}
```

**Response:**
```json
{
  "success": true,
  "score": 85,
  "comments": "Strong profile with diverse technical skills and competitive rates. Well-structured bio highlighting relevant experience.",
  "suggestions": [
    "Consider adding more specific project examples in your bio",
    "Your hourly rate is competitive for your experience level",
    "Strong skill set - consider highlighting your most in-demand skills first"
  ],
  "profileId": "profile_uuid"
}
```

**Scoring Algorithm (Suggested):**
- **Bio Quality (20 points):** Length (min 100 chars), clarity, keywords
- **Skills (25 points):** Number of skills (5-15 optimal), relevance, demand
- **Experience (20 points):** Years (1-2: 10pts, 3-5: 15pts, 6+: 20pts)
- **Rate Competitiveness (15 points):** Compare to market average for experience
- **Links Provided (20 points):** Portfolio (+8), LinkedIn (+6), GitHub (+6)

---

### 4. Upload CV
**Endpoint:** `POST /profile/upload-cv`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
cv: [PDF file]
userId: "uuid"
```

**Response:**
```json
{
  "success": true,
  "score": 78,
  "comments": "CV shows strong technical background. Well-organized with clear career progression. PDF formatting is professional.",
  "suggestions": [
    "Add more quantifiable achievements (e.g., 'Increased performance by 40%')",
    "Include specific technologies used in each role",
    "Consider adding a summary section at the top"
  ],
  "profileId": "profile_uuid"
}
```

**Implementation Notes:**
- Parse PDF using libraries like `PyPDF2`, `pdfplumber`, or `pypdf`
- Extract text and analyze:
  - Length (1-3 pages ideal)
  - Structure (sections detected)
  - Keywords (technical skills, action verbs)
  - Contact information presence
  - Education and experience sections
- Use NLP for quality analysis (optional: spaCy, NLTK)
- Store CV in cloud storage (AWS S3, Google Cloud Storage)
- Virus scan the uploaded file

**CV Scoring Algorithm:**
- **Structure (25 points):** Clear sections, logical flow
- **Content Quality (30 points):** Quantifiable achievements, action verbs
- **Technical Skills (20 points):** Relevant keywords, specific technologies
- **Length (10 points):** 1-3 pages (deduct if too short/long)
- **Formatting (15 points):** Professional, readable, consistent

---

### 5. Update Profile
**Endpoint:** `PUT /profile/update`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "bio": "Updated bio text...",
  "skills": ["React", "Python", "Django"],
  "experience_years": 6,
  "hourly_rate": 85.00,
  "portfolio_url": "https://newportfolio.com",
  "linkedin_url": "https://linkedin.com/in/newusername",
  "github_url": "https://github.com/newusername"
}
```

**Response:**
```json
{
  "success": true,
  "score": 88,
  "comments": "Profile improvements detected! Your updated bio is more compelling and the additional experience strengthens your profile.",
  "suggestions": [
    "Excellent progress - your score increased by 3 points",
    "Consider expanding on your recent projects"
  ],
  "profileId": "profile_uuid"
}
```

---

## Job Management

### 6. Get All Jobs
**Endpoint:** `GET /jobs/all`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Senior Full-Stack Developer",
    "description": "Looking for an experienced developer to join our growing team...",
    "budget": "$5000-$8000",
    "location": "Remote",
    "job_type": "Full-time",
    "experience_level": "Senior",
    "status": "open",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "ai_generated_criteria": {
      "min_years_experience": 5,
      "required_skills": ["React", "Node.js", "TypeScript"],
      "preferred_skills": ["AWS", "Docker"]
    },
    "client": 123,
    "required_skills": ["React", "Node.js", "TypeScript", "AWS"]
  },
  {
    "id": 2,
    "title": "React Native Developer",
    "description": "Build cutting-edge mobile applications for top-tier clients...",
    "budget": "$4000-$6000",
    "location": "San Francisco, CA",
    "job_type": "Contract",
    "experience_level": "Mid-level",
    "status": "open",
    "created_at": "2025-01-16T14:20:00Z",
    "updated_at": "2025-01-16T14:20:00Z",
    "ai_generated_criteria": null,
    "client": 456,
    "required_skills": ["React Native", "iOS", "Android", "Firebase"]
  }
]
```

**Implementation Notes:**
- Return all active jobs from the database
- Filter by status (default: only return "open" jobs)
- Include pagination for large datasets (query params: `?page=1&limit=20`)
- Sort by created_at (newest first)
- Optionally filter by location, job_type, experience_level via query params

**FastAPI Example:**
```python
@app.get("/api/jobs/all")
async def get_all_jobs(
    page: int = 1,
    limit: int = 20,
    status: str = "open",
    job_type: Optional[str] = None,
    location: Optional[str] = None
):
    # Query database with filters
    jobs = query_jobs_from_db(
        page=page,
        limit=limit,
        status=status,
        job_type=job_type,
        location=location
    )
    
    return jobs
```

---

## Python Backend Implementation Example

### Using FastAPI

```python
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import bcrypt
import jwt
from datetime import datetime, timedelta
import os

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileData(BaseModel):
    userId: str
    bio: str
    skills: List[str]
    experience_years: Optional[int]
    hourly_rate: Optional[float]
    portfolio_url: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]

class ProfileEvaluationResponse(BaseModel):
    success: bool
    score: int
    comments: str
    suggestions: List[str]
    profileId: str

# Auth endpoints
@app.post("/api/auth/register")
async def register(data: RegisterRequest):
    # Hash password
    hashed = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
    
    # Save user to database (implement your DB logic)
    user_id = "generated_uuid"
    
    # Generate JWT token
    token = jwt.encode(
        {"userId": user_id, "exp": datetime.utcnow() + timedelta(hours=24)},
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )
    
    return {
        "success": True,
        "token": token,
        "userId": user_id,
        "role": data.role
    }

@app.post("/api/auth/login")
async def login(data: LoginRequest):
    # Verify credentials (implement your DB logic)
    # ...
    
    token = jwt.encode(
        {"userId": "user_id", "exp": datetime.utcnow() + timedelta(hours=24)},
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )
    
    return {
        "success": True,
        "token": token,
        "userId": "user_id",
        "role": "freelancer"
    }

# Profile evaluation
@app.post("/api/profile/evaluate", response_model=ProfileEvaluationResponse)
async def evaluate_profile(data: ProfileData):
    # Implement scoring logic
    score = calculate_profile_score(data)
    comments = generate_comments(data, score)
    suggestions = generate_suggestions(data)
    
    return {
        "success": True,
        "score": score,
        "comments": comments,
        "suggestions": suggestions,
        "profileId": data.userId
    }

@app.post("/api/profile/upload-cv", response_model=ProfileEvaluationResponse)
async def upload_cv(
    cv: UploadFile = File(...),
    userId: str = Form(...)
):
    # Save file
    file_location = f"uploads/{userId}_{cv.filename}"
    with open(file_location, "wb") as f:
        f.write(await cv.read())
    
    # Parse and evaluate CV
    score = evaluate_cv(file_location)
    comments = "CV evaluation complete"
    suggestions = ["Add more details", "Improve formatting"]
    
    return {
        "success": True,
        "score": score,
        "comments": comments,
        "suggestions": suggestions,
        "profileId": userId
    }

def calculate_profile_score(data: ProfileData) -> int:
    score = 0
    
    # Bio scoring (20 points)
    if data.bio and len(data.bio) >= 100:
        score += 20
    elif data.bio:
        score += 10
    
    # Skills scoring (25 points)
    skill_count = len(data.skills)
    if 5 <= skill_count <= 15:
        score += 25
    elif skill_count > 0:
        score += 15
    
    # Experience scoring (20 points)
    if data.experience_years:
        if data.experience_years >= 6:
            score += 20
        elif data.experience_years >= 3:
            score += 15
        else:
            score += 10
    
    # Links scoring (20 points)
    if data.portfolio_url:
        score += 8
    if data.linkedin_url:
        score += 6
    if data.github_url:
        score += 6
    
    # Rate scoring (15 points)
    if data.hourly_rate and 30 <= data.hourly_rate <= 150:
        score += 15
    
    return min(score, 100)

def generate_comments(data: ProfileData, score: int) -> str:
    if score >= 80:
        return "Excellent profile! Well-structured with comprehensive information."
    elif score >= 60:
        return "Good profile with room for improvement in some areas."
    else:
        return "Profile needs more detail to attract clients effectively."

def generate_suggestions(data: ProfileData) -> List[str]:
    suggestions = []
    
    if not data.bio or len(data.bio) < 100:
        suggestions.append("Expand your bio to at least 100 characters")
    
    if len(data.skills) < 5:
        suggestions.append("Add more relevant skills to your profile")
    
    if not data.portfolio_url:
        suggestions.append("Add a portfolio URL to showcase your work")
    
    return suggestions

def evaluate_cv(file_path: str) -> int:
    # Implement CV parsing and scoring
    # Use PyPDF2, pdfplumber, or similar
    return 75  # Placeholder
```

---

## Environment Setup

### Frontend (.env)
```env
VITE_PYTHON_BACKEND_URL=http://localhost:8000/api
```

### Backend (.env)
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

---

## Testing the Integration

1. **Start Python Backend:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

2. **Configure Frontend:**
   Add `VITE_PYTHON_BACKEND_URL` to your `.env` file

3. **Test Authentication:**
   - Register a new freelancer account
   - Login with credentials

4. **Test Profile:**
   - Create/update profile → View score and comments
   - Upload CV → View evaluation results

---

## Security Checklist

- ✅ Password hashing with bcrypt (min 10 rounds)
- ✅ JWT token authentication
- ✅ Rate limiting on auth endpoints
- ✅ Input validation and sanitization
- ✅ CORS properly configured
- ✅ File upload validation (size, type)
- ✅ SQL injection prevention (use ORMs)
- ✅ HTTPS in production
- ✅ Environment variables for secrets

---

## Next Steps

1. Set up your Python backend using FastAPI or Flask
2. Implement the required endpoints above
3. Configure CORS to allow your frontend domain
4. Test all endpoints with the React application
5. Deploy backend to your hosting service
6. Update frontend environment variable with production URL
