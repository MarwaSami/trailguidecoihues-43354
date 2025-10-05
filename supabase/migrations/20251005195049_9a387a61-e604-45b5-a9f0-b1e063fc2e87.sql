-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('freelancer', 'client', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'freelancer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create freelancer_profiles table for freelancer-specific data
CREATE TABLE public.freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  cv_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for freelancer_profiles table
CREATE POLICY "Freelancers can view their own profile"
  ON public.freelancer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Freelancers can update their own profile"
  ON public.freelancer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Freelancers can insert their own profile"
  ON public.freelancer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients and admins can view freelancer profiles"
  ON public.freelancer_profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'client') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get role from metadata, default to 'freelancer'
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'freelancer'
  );

  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    user_role
  );

  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);

  -- If freelancer, create freelancer profile
  IF user_role = 'freelancer' THEN
    INSERT INTO public.freelancer_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_freelancer_profiles_updated_at
  BEFORE UPDATE ON public.freelancer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();