import { AudioRecorder } from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AudioRecorderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Audio Recorder</h1>
          <p className="text-muted-foreground mb-8">
            Record audio and upload to the server
          </p>

          <AudioRecorder
            onSuccess={(data) => console.log('Upload success:', data)}
            onError={(error) => console.error('Upload error:', error)}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioRecorderPage;
