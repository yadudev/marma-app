import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AddDoctorModal from '../Therapist/AddmodalTherapist';
import Learnervidoes from './Learnervidoes';
import { baseUrl } from '../../utils/config';

// Define the type for a lesson object
type Lesson = {
  id: number;
  name: string;
  duration: string;
  completed: boolean;
};

const LearnerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Lesson | null>(null); // 🔧 Typed properly

  const [currentLesson, setCurrentLesson] = useState(1);
  const totalLessons = 15;
  const progress = (currentLesson / totalLessons) * 100;
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/learner`); // or your API URL
        const data = await res.json();
        setLessons(data?.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);
  
  const courseCompleted = progress === 100;

  return (
    <div className="space-y-6">
      <div className="flex align-middle justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>

        <Button
          className="mt-4 md:mt-0 text-[12px] md:text-[12px]"
          size="lg"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false);
            setEditData(null);
          }}
        >
          <Plus className="mr-2" size={18} />
          Add New Videos
        </Button>
      </div>

      <Learnervidoes
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditData(null);
        }}
        apiUrl={`${baseUrl}`}
        isEdit={isEditMode}
        initialData={editData}
      />

      {courseCompleted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Course Completed!</h3>
                <p className="text-green-700">
                  You can now book your three-day residential Professional Training session.
                </p>
                <Button className="mt-4" variant="success">
                  Book Residential Training
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Course Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-col justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${lesson.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{lesson.name}</h4>
                    <p className="text-sm text-gray-500">Duration: {lesson.duration}</p>
                  </div>
                </div>

                <video
                  src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                  className="h-32 w-full object-cover rounded"
                  controls
                />

                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditMode(true);
                      setEditData(lesson); // ✅ No error now
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnerPage;
