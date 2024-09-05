"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader,CardTitle} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addinfo } from '../utils/infoSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function ProfessorForm() {
  const [professorData, setProfessorData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    designation: '',
    department: '',
    branch: '',
    url: '',
    imageUrl: '',
    dateOfJoining: '',
    researchTeachingExperience: '',
    address: '',
    email: '',
    phoneResidence: '',
    phoneMobile: '',
    officeExtension: '',
    researchArea: '',
    coursesTaughtUG: '',
    coursesTaughtPG: '',
    academicInfo: {
      bachelors: { degree: '', institute: '', year: '', subject: '' },
      masters: { degree: '', institute: '', year: '', subject: '' },
      phd: { degree: '', institute: '', year: '', subject: '' }
    },
    paperpublished: [],
    researchguidance: [],
    awardandhonor: [],
    membership: [],
    professionalservices: [],
    fundedresearchproject: [],
    trainingattended: [],
    trainingConducted: []
  });

  const router = useRouter();
const dispatch = useDispatch();
const info = useSelector(state=>state.info.info)
const user = useSelector(state=>state.user.userinfo)
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      if (!user) {
        router.push('/signin'); 
        return;
      }

      if (user) {
        const { data, error: fetchError } = await supabase
          .from('professors')
          .select('*')
          .eq('email', user.email)
          .single();
          {}

        if (fetchError) {
          console.error('Error fetching professor data:', fetchError);
        } else if (data) {
          console.log(info)
dispatch(addinfo(data));
          setProfessorData(data);
        }
      }
    };

    fetchUserData();
  }, []);
  const handleFieldChange = (field, index, value) => {
    const updatedArray = [...professorData[field]];
    updatedArray[index] = value;
    setProfessorData(prevState => ({ ...prevState, [field]: updatedArray }));
  };

  const handleAddField = (field) => {
    setProfessorData(prevState => ({
      ...prevState,
      [field]: [...prevState[field], ''] // Add an empty string as a new entry
    }));
  };

  const handleRemoveField = (field, index) => {
    const updatedArray = [...professorData[field]];
    updatedArray.splice(index, 1);
    setProfessorData(prevState => ({ ...prevState, [field]: updatedArray }));
  };


 const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (user) {
      const { data, error: saveError } = await supabase
        .from('professors')
        .upsert({ ...professorData, email: user.email })
        .eq('email', user.email);

      if (saveError) {
        console.error('Error saving professor data:', saveError);
      } else {
        console.log('Professor data saved successfully');
        router.push('/dashboard'); // Redirect after saving
      }
    }
  };

  const handleArrayChange = (field, newValue) => {
    setProfessorData(prevState => ({
      ...prevState,
      [field]: Array.isArray(prevState[field]) 
        ? [...prevState[field], newValue] // Spread existing array and add the new value
        : [newValue], // If not an array (or undefined), initialize as an array with the new value
    }));
  };
  
  
  const handleAcademicChange = (key, value) => {
    setProfessorData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };



const handleImageUpload = async (file) => {
  const fileName = `${professorData.name}`;
  const { data, error } = await supabase.storage
    .from('profilePhoto') // Replace with your actual bucket name
    .upload(`profiles/${professorData.name}`, file); // Customize the path as needed

  if (error) {
    console.error('Error uploading image:', error.message);
  } else {
    console.log('Image uploaded successfully:', data.Key);
    
    // Optionally, save the image URL to your database
    const imageUrl = `${supabase.storage.from('profilePhoto').getPublicUrl(`profiles/${fileName}`).data.publicUrl}`;
    console.log('Image URL:', imageUrl);
    
    // Update the state with the image URL
    setProfessorData({ ...professorData, imageUrl });
  }
};


  

  
  
  return (
<Card className="max-w-4xl m-4 mx-auto border border-gray-300 rounded-lg shadow-lg">
  <CardHeader className="p-4 text-white bg-blue-500 rounded-t-lg">
    <CardTitle className="text-2xl font-semibold">Professor Information Form</CardTitle>
  </CardHeader>
  <CardContent className="p-6 space-y-6">
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name" className="font-medium text-gray-700">Name</Label>
          <Input
            id="name"
            type="text"
            value={professorData.name}
            onChange={(e) => setProfessorData({ ...professorData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="gender" className="font-medium text-gray-700">Gender</Label>
          <Input
            id="gender"
            type="text"
            value={professorData.gender}
            onChange={(e) => setProfessorData({ ...professorData, gender: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="birthDate" className="font-medium text-gray-700">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={professorData.birthDate}
            onChange={(e) => setProfessorData({ ...professorData, birthDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="designation" className="font-medium text-gray-700">Designation</Label>
          <Input
            id="designation"
            type="text"
            value={professorData.designation}
            onChange={(e) => setProfessorData({ ...professorData, designation: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="department" className="font-medium text-gray-700">Department</Label>
          <Input
            id="department"
            type="text"
            value={professorData.department}
            onChange={(e) => setProfessorData({ ...professorData, department: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Card className="border border-gray-300 rounded-lg shadow-sm">
            <CardHeader className="px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-700">Select Branch</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Select
                onValueChange={(value) => setProfessorData({ ...professorData, branch: value })}
                value={professorData.branch || ""}
                className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="MCE">MCE</SelectItem>
                  <SelectItem value="CVE">CVE</SelectItem>
                  <SelectItem value="APS">APS</SelectItem>
                  <SelectItem value="HSS">HSS</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Upload */}
      <Card className="transition-shadow duration-300 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg">
        <CardHeader className="px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-50">
          <CardTitle className="text-lg font-semibold text-gray-700">Upload Profile Image</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-4 space-y-4">
          <img
            src={professorData.imageUrl || '/placeholder.png'}
            alt="Profile"
            className="object-cover w-24 h-24 transition duration-300 ease-in-out transform border-2 border-gray-300 rounded-full shadow-sm hover:scale-105"
          />

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                await handleImageUpload(file);
              }
            }}
            className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </CardContent>
      </Card>






          {/* Research Guidance */}
          <Card className="mb-4 transition-shadow duration-300 border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
  <CardHeader className="px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-50">
    <CardTitle className="text-lg font-semibold text-gray-700">
      Research Guidance
    </CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <Textarea
      rows={5}
      placeholder="Enter research guidance details here..."
      value={professorData.researchguidance?.join('\n')}
      onChange={(e) => {
        const newGuidance = e.target.value.split('\n');
        setProfessorData({ ...professorData, researchguidance: newguidance });
      }}
      className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Button
      type="button"
      onClick={() => handleArrayChange('researchGuidance', 'New Guidance Entry')}
      className="w-full mt-4 text-white bg-blue-500 hover:bg-blue-600"
    >
      Add Guidance
    </Button>
  </CardContent>
</Card>


 {/* Academic Information */}
 <div className="space-y-4">
    {/* UG Course Details */}
    <Card>
      <CardHeader>
        <CardTitle>Undergraduate Course Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="degree_ug">Degree (UG)</Label>
          <Input
            id="degree_ug"
            placeholder="Enter your UG degree"
            value={professorData.degree_ug}
            onChange={(e) => setProfessorData({ ...professorData, degree_ug: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="institute_university_ug">Institute/University (UG)</Label>
          <Input
            id="institute_university_ug"
            placeholder="Enter your UG institute/university"
            value={professorData.institute_university_ug}
            onChange={(e) => setProfessorData({ ...professorData, institute_university_ug: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="year_ug">Year of Graduation (UG)</Label>
          <Input
            id="year_ug"
            placeholder="Enter your UG graduation year"
            value={professorData.year_ug}
            onChange={(e) => setProfessorData({ ...professorData, year_ug: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>

    {/* PG Course Details */}
    <Card>
      <CardHeader>
        <CardTitle>Postgraduate Course Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="degree_pg">Degree (PG)</Label>
          <Input
            id="degree_pg"
            placeholder="Enter your PG degree"
            value={professorData.degree_pg}
            onChange={(e) => setProfessorData({ ...professorData, degree_pg: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="year_pg">Year of Graduation (PG)</Label>
          <Input
            id="year_pg"
            placeholder="Enter your PG graduation year"
            value={professorData.year_pg}
            onChange={(e) => setProfessorData({ ...professorData, year_pg: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>

    <Card className="mb-4">
      <CardHeader>
        <CardTitle>PhD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Degree (PhD)"
          value={professorData.degree_phd}
          onChange={(e) => handleAcademicChange('degree_phd', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <Input
          type="text"
          placeholder="Institute (PhD)"
          value={professorData.institute_university_phd}
          onChange={(e) => handleAcademicChange('institute_university_phd', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <Input
          type="text"
          placeholder="Year (PhD)"
          value={professorData.year_phd}
          onChange={(e) => handleAcademicChange('year_phd', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </CardContent>
    </Card>

    {/* Academic Information */}
    {/* UG Courses */}
    <Card className="mb-4">
        <CardHeader>
          <CardTitle>UG Courses Taught</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {professorData.ug_courses?.map((item, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`UG Course ${index + 1}`}
              value={item}
              onChange={(e) => {
                const newCourses = [...professorData.ug_courses];
                newCourses[index] = e.target.value;
                setProfessorData({ ...professorData, ug_courses: newCourses });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          ))}
          <Button
            type="button"
            onClick={() => handleArrayChange('ug_courses', '')}
            className="w-full text-white bg-blue-500 hover:bg-blue-600"
          >
            Add UG Course
          </Button>
        </CardContent>
      </Card>

      {/* PG Courses */}
      <Card>
        <CardHeader>
          <CardTitle>PG Courses Taught</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {professorData.pg_courses?.map((item, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`PG Course ${index + 1}`}
              value={item}
              onChange={(e) => {
                const newCourses = [...professorData.pg_courses];
                newCourses[index] = e.target.value;
                setProfessorData({ ...professorData, pg_courses: newCourses });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          ))}
          <Button
            type="button"
            onClick={() => handleArrayChange('pg_courses', '')}
            className="w-full text-white bg-blue-500 hover:bg-blue-600"
          >
            Add PG Course
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
    <CardHeader>
      <CardTitle>Award and Honor</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {professorData.awardandhonor?.map((item, index) => (
        <Input
          key={index}
          type="text"
          placeholder={`Award ${index + 1}`}
          value={item}
          onChange={(e) => onChange('awardandhonor', index, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      ))}
      <Button
        type="button"
        onClick={() => onAdd('awardandhonor')}
        className="mt-2"
      >
        Add Award
      </Button>
    </CardContent>
  </Card>
  {/* Paper Published */}
{/* Paper Published */}
<Card className="mb-4">
  <CardHeader>
    <CardTitle>Papers Published</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.paperpublished?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newPapers = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, paperpublished: newPapers });
      }}
      placeholder="Enter papers, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.paperpublished?.length || 1}
    />
  </CardContent>
</Card>





  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Membership and Professional Society</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {professorData.membership?.map((item, index) => (
        <Input
          key={index}
          type="text"
          placeholder={`Membership ${index + 1}`}
          value={item}
          onChange={(e) => onChange('membership', index, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      ))}
      <Button
        type="button"
        onClick={() => onAdd('membership')}
        className="mt-2"
      >
        Add Membership
      </Button>
    </CardContent>
  </Card>

  <Card className="mb-4 border border-gray-200 rounded-lg shadow-md">
  <CardHeader className="px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-50">
    <CardTitle className="text-lg font-semibold text-gray-700">
      Professional Services
    </CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <textarea
      rows={5}
      placeholder="Enter details of professional services provided. (e.g., Consulting, Board Membership, Reviewer...)"
      value={professorData.professionalservices?.join('\n')}
      onChange={(e) => {
        const newProfessionalServices = e.target.value.split('\n');
        setProfessorData({ ...professorData, professionalservices: newProfessionalServices });
      }}
      className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Button
      type="button"
      className="w-full mt-4 text-white bg-blue-500 hover:bg-blue-600"
    >
      Add Professional Service
    </Button>
  </CardContent>
</Card>

  <Card className="mb-4">
        <CardHeader>
          <CardTitle>Funded Research Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {professorData.fundedresearchproject?.map((item, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Project ${index + 1}`}
              value={item}
              onChange={(e) => handleFieldChange('fundedresearchproject', index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          ))}
          <Button
            type="button"
            onClick={() => handleAddField('fundedresearchproject')}
            className="mt-2"
          >
            Add Project
          </Button>
        </CardContent>
      </Card>
      <div>
      {/* Training/Conferences/Short Term Courses Attended */}
      <Card className="mb-4 border border-gray-200 rounded-lg shadow-md">
  <CardHeader className="px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-50">
    <CardTitle className="text-lg font-semibold text-gray-700">
      Training/Conferences/Short Term Courses Attended
    </CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <Textarea
      rows={5}
      placeholder="Enter details of trainings, conferences, or short term courses attended. (e.g., MAY 2017: 10 day Faculty Development Programme...)"
      value={professorData.trainingattended.join('\n')}
      onChange={(e) => {
        const newTraining = e.target.value.split('\n');
        setProfessorData({ ...professorData, trainingattended: newTraining });
      }}
      className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Button
      type="button"
      onClick={() => handleAddField('trainingattended')}
      className="w-full mt-4 text-white bg-blue-500 hover:bg-blue-600"
    >
      Add Training Attended
    </Button>
  </CardContent>
</Card>

      {/*conducted */}
      <Card className="mb-4 border border-gray-200 rounded-lg shadow-md">
  <CardHeader className="px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-50">
    <CardTitle className="text-lg font-semibold text-gray-700">
      Training/Conferences/Short Term Courses Conducted
    </CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <textarea
      rows={5}
      placeholder="Enter details of trainings, conferences, or short term courses conducted. (e.g., MAY 2017: 10 day Faculty Development Programme...)"
      value={professorData.trainingConducted.join('\n')}
      onChange={(e) => {
        const newTrainingConducted = e.target.value.split('\n');
        setProfessorData({ ...professorData, trainingConducted: newTrainingConducted });
      }}
      className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Button
      type="button"
      className="w-full mt-4 "
    >
      Add Training Conducted
    </Button>
  </CardContent>
</Card>

    </div>
    <Button type="submit" className="w-full">Submit</Button>
  </div>
  </form>
  </CardContent> </Card>
  );
}
