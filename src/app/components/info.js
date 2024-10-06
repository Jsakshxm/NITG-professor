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

    research_experience: '',
    address: '',
    email: '',
    phone_residence: '',
    phone_mobile: '',
    office_extension: '',
    research_area: '',
    ug_courses: [],
  pg_courses: [],
    degree_ug: '',                     // Added individual field for UG degree
    institute_university_ug: '',       // Added individual field for UG institute/university
    year_ug: '',                       // Added individual field for UG year of graduation
    degree_pg: '',                     // Added individual field for PG degree
    institute_university_pg: '',       // Added individual field for PG institute/university
    year_pg: '',                       // Added individual field for PG year of graduation
    degree_phd: '',                    // Added individual field for Ph.D. degree
    institute_university_phd: '',      // Added individual field for Ph.D. institute/university
    year_phd: '',                      // Added individual field for Ph.D. year of graduation
    paperpublished: [],
    researchguidance: [],
    awardandhonor: [],
    membership: [],
    professionalservices: [],
    fundedresearchproject: [],
    trainingattended: [],
    trainingConducted: [],
    journal_publications_international: [],  // Field for Journal Publications (International)
    journal_publications_national: [],       // Field for Journal Publications (National)
    conference_publications_international: [],  // Field for Conference Publications (International)
    conference_publications_national: [],    // Field for Conference Publications (National)
    book_chapters: [],                       // Field for Book Chapters
    books_authored: [],                      // Field for Books Authored
    patents: []                              // Field for Patents
  });
  
  
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
        setLoading(false);
      } else {
setLoading(false);
        console.log('Professor data saved successfully');
        router.push('/dashboard'); 
      }
    }
    if(professorData.name === '' && professorData.designation === '' && professorData.department === ''){
      alert('Please make sure name, designation and department are filled');}
      setLoading(false);
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
    <CardTitle className="text-2xl font-semibold">User Information Form</CardTitle>
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
        setProfessorData({ ...professorData, researchguidance: newGuidance });
      }}
      className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {/* <Button
      type="button"
      onClick={() => handleArrayChange('researchGuidance', 'New Guidance Entry')}
      className="w-full mt-4 text-white bg-blue-500 hover:bg-blue-600"
    >
      Add Guidance
    </Button> */}
  </CardContent>
</Card>


 {/* Academic Information */}
 <div className="space-y-4">
    {/* UG Course Details */}
    <Card className="mb-4">
  <CardHeader>
    <CardTitle>Academic Details (UG)</CardTitle>
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
<Card className="mb-4">
  <CardHeader>
    <CardTitle>Academic Details (PG)</CardTitle>
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
      <Label htmlFor="institute_university_pg">Institute/University (PG)</Label>
      <Input
        id="institute_university_pg"
        placeholder="Enter your PG institute/university"
        value={professorData.institute_university_pg}
        onChange={(e) => setProfessorData({ ...professorData, institute_university_pg: e.target.value })}
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

{/* PhD Details */}
<Card className="mb-4">
  <CardHeader>
    <CardTitle>Academic Details (PhD)</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="degree_phd">Degree (PhD)</Label>
      <Input
        id="degree_phd"
        placeholder="Enter your PhD degree"
        value={professorData.degree_phd}
        onChange={(e) => setProfessorData({ ...professorData, degree_phd: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="institute_university_phd">Institute/University (PhD)</Label>
      <Input
        id="institute_university_phd"
        placeholder="Enter your PhD institute/university"
        value={professorData.institute_university_phd}
        onChange={(e) => setProfessorData({ ...professorData, institute_university_phd: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="year_phd">Year of Graduation (PhD)</Label>
      <Input
        id="year_phd"
        placeholder="Enter your PhD graduation year"
        value={professorData.year_phd}
        onChange={(e) => setProfessorData({ ...professorData, year_phd: e.target.value })}
      />
    </div>
  </CardContent>
</Card>


    {/* Academic Information */}
    {/* UG Courses */}
    <Card className="mb-4">
  <CardHeader>
    <CardTitle>UG Courses Taught</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData?.ug_courses?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newCourses = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, ug_courses: newCourses });
      }}
      placeholder="Enter UG courses, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.ug_courses?.length || 1}
    />
  </CardContent>
</Card>


      {/* PG Courses */}
      <Card className="mb-4">
  <CardHeader>
    <CardTitle>PG Courses Taught</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.pg_courses?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newCourses = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, pg_courses: newCourses });
      }}
      placeholder="Enter PG courses, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.pg_courses?.length || 1}
    />
  </CardContent>
</Card>


      <Card className="mb-4">
  <CardHeader>
    <CardTitle>Awards and Honors</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.awardandhonor?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newAwards = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, awardandhonor: newAwards });
      }}
      placeholder="Enter awards and honors, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.awardandhonor?.length || 1}
    />
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
    <CardTitle>Journal Publications (International)</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.journal_publications_international?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newPublications = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, journal_publications_international: newPublications });
      }}
      placeholder="Enter publications, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.journal_publications_international?.length || 1}
    />
  </CardContent>
</Card>

<Card className="mb-4">
  <CardHeader>
    <CardTitle>Journal Publications (National)</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.journal_publications_national?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newPublications = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, journal_publications_national: newPublications });
      }}
      placeholder="Enter publications, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.journal_publications_national?.length || 1}
    />
  </CardContent>
</Card>

<Card className="mb-4">
  <CardHeader>
    <CardTitle>Conference Publications (International)</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.conference_publications_international?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newPublications = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, conference_publications_international: newPublications });
      }}
      placeholder="Enter publications, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.conference_publications_international?.length || 1}
    />
  </CardContent>
</Card>

<Card className="mb-4">
  <CardHeader>
    <CardTitle>Conference Publications (National)</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.conference_publications_national?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newPublications = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, conference_publications_national: newPublications });
      }}
      placeholder="Enter publications, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.conference_publications_national?.length || 1}
    />
  </CardContent>
</Card>

<Card className="mb-4">
  <CardHeader>
    <CardTitle>Book Chapters</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.book_chapters?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newChapters = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, book_chapters: newChapters });
      }}
      placeholder="Enter book chapters, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.book_chapters?.length || 1}
    />
  </CardContent>
</Card>

<Card className="mb-4">
  <CardHeader>
    <CardTitle>Books Authored</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.books_authored?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newBooks = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, books_authored: newBooks });
      }}
      placeholder="Enter books authored, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.books_authored?.length || 1}
    />
  </CardContent>
</Card>

<Card className="mb-4">
  <CardHeader>
    <CardTitle>Patents</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.patents?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newPatents = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, patents: newPatents });
      }}
      placeholder="Enter patents, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.patents?.length || 1}
    />
  </CardContent>
</Card>






<Card className="mb-4">
  <CardHeader>
    <CardTitle>Membership and Professional Society</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.membership?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newMemberships = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, membership: newMemberships });
      }}
      placeholder="Enter memberships, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.membership?.length || 1}
    />
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
   
  </CardContent>
</Card>
<Card className="mb-4">
  <CardHeader>
    <CardTitle>Funded Research Project</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea
      value={professorData.fundedresearchproject?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      onChange={(e) => {
        const newProjects = e.target.value.split('\n').map((line) => line.replace(/^\d+\.\s*/, ''));
        setProfessorData({ ...professorData, fundedresearchproject: newProjects });
      }}
      placeholder="Enter projects, one per line"
      className="w-full p-2 border border-gray-300 rounded-lg"
      rows={professorData.fundedresearchproject?.length || 1}
    />
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
    <Textarea
      rows={5}
      placeholder="Enter details of trainings, conferences, or short term courses conducted. (e.g., MAY 2017: 10 day Faculty Development Programme...)"
      value={professorData.trainingConducted.join('\n')}
      onChange={(e) => {
        const newTrainingConducted = e.target.value.split('\n');
        setProfessorData({ ...professorData, trainingConducted: newTrainingConducted });
      }}
      className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
   
  </CardContent>
</Card>

    </div>
    <Button type="submit" className="w-full">Submit</Button>
  </div>
  </form>
  </CardContent> </Card>
  );
}
