"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { addinfo } from '../utils/infoSlice';

export default function ProfessorForm() {
  const [professorData, setProfessorData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    designation: '',
    department: '', 
    url: '',
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
    paperPublished: [],
    researchguidance: [],
    awardandhonor: [],
    membership: [],
    professionalservices: [],
    fundedresearchproject: [],
    trainingattended: [],
    trainingconducted: []
  });

  const router = useRouter();
const dispatch = useDispatch();
const info = useSelector(state=>state.info)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      if (!user) {
        router.push('/signin'); // Redirect to sign-in page if user is not logged in
        return;
      }

      if (user) {
        const { data, error: fetchError } = await supabase
          .from('professors')
          .select('*')
          .eq('email', user.email)
          .single();

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
        .upsert({ ...professorData, email: user.email }) // Insert or update professor data
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
  

  
  
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl p-6 mx-auto space-y-6 bg-white rounded-lg shadow-md">
    {/* Basic Information */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input
        type="text"
        placeholder="Name"
        value={info?.name}
        onChange={(e) => setProfessorData({ ...professorData, name: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="Gender"
        value={professorData.gender}
        onChange={(e) => setProfessorData({ ...professorData, gender: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      Birth Date:
      <input
        type="date"
        placeholder="Birth Date"
        value={professorData.birthDate}
        onChange={(e) => setProfessorData({ ...professorData, birthDate: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="Designation"
        value={professorData.designation}
        onChange={(e) => setProfessorData({ ...professorData, designation: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="Department"
        value={professorData.department}
        onChange={(e) => setProfessorData({ ...professorData, department: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  
    {/* Research Guidance */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Research Guidance</h3>
      {professorData.researchguidance?.map((item, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Guidance ${index + 1}`}
          value={item}
          onChange={(e) => {
            const newGuidance = [...professorData.researchGuidance];
            newGuidance[index] = e.target.value;
            setProfessorData({ ...professorData, researchGuidance: newGuidance });
          }}
          className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
        />
      ))}
      <button
        type="button"
        onClick={() => handleArrayChange('researchGuidance', 'New Guidance Entry')}
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Add Guidance
      </button>
    </div>
 {/* Academic Information */}
 <div className="mb-4">
  {/* Bachelors */}
  <h4 className="mb-2 font-medium text-gray-600">Bachelors</h4>
  <input
    type="text"
    placeholder="Degree (UG)"
    value={professorData.degree_ug}
    onChange={(e) => handleAcademicChange('degree_ug', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
  <input
    type="text"
    placeholder="Institute (UG)"
    value={professorData.institute_university_ug}
    onChange={(e) => handleAcademicChange('institute_university_ug', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
  <input
    type="text"
    placeholder="Year (UG)"
    value={professorData.year_ug}
    onChange={(e) => handleAcademicChange('year_ug', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
</div>

{/* Masters */}
<div className="mb-4">
  <h4 className="mb-2 font-medium text-gray-600">Masters</h4>
  <input
    type="text"
    placeholder="Degree (PG)"
    value={professorData.degree_pg}
    onChange={(e) => handleAcademicChange('degree_pg', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
  <input
    type="text"
    placeholder="Institute (PG)"
    value={professorData.institute_university_pg}
    onChange={(e) => handleAcademicChange('institute_university_pg', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
  <input
    type="text"
    placeholder="Year (PG)"
    value={professorData.year_pg}
    onChange={(e) => handleAcademicChange('year_pg', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
</div>

{/* PhD */}
<div className="mb-4">
  <h4 className="mb-2 font-medium text-gray-600">PhD</h4>
  <input
    type="text"
    placeholder="Degree (PhD)"
    value={professorData.degree_phd}
    onChange={(e) => handleAcademicChange('degree_phd', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
  <input
    type="text"
    placeholder="Institute (PhD)"
    value={professorData.institute_university_phd}
    onChange={(e) => handleAcademicChange('institute_university_phd', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
  <input
    type="text"
    placeholder="Year (PhD)"
    value={professorData.year_phd}
    onChange={(e) => handleAcademicChange('year_phd', e.target.value)}
    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
  />
</div>

     {/* UG Courses */}
<div>
  <h3 className="mb-4 text-lg font-semibold text-gray-700">UG Courses Taught</h3>
  {professorData.ug_courses?.map((item, index) => (
    <input
      key={index}
      type="text"
      placeholder={`UG Course ${index + 1}`}
      value={item}
      onChange={(e) => {
        const newCourses = [...professorData.ug_courses];
        newCourses[index] = e.target.value;
        setProfessorData({ ...professorData, ug_courses: newCourses });
      }}
      className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
    />
  ))}
  <button
    type="button"
    onClick={() => handleArrayChange('ug_courses', '')}
    className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
  >
    Add UG Course
  </button>
</div>

{/* PG Courses */}
<div>
  <h3 className="mb-4 text-lg font-semibold text-gray-700">PG Courses Taught</h3>
  {professorData.pg_courses?.map((item, index) => (
    <input
      key={index}
      type="text"
      placeholder={`PG Course ${index + 1}`}
      value={item}
      onChange={(e) => {
        const newCourses = [...professorData.pg_courses];
        newCourses[index] = e.target.value;
        setProfessorData({ ...professorData, pg_courses: newCourses });
      }}
      className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
    />
  ))}
  <button
    type="button"
    onClick={() => handleArrayChange('pg_courses', '')}
    className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
  >
    Add PG Course
  </button>
</div>

  
    {/* Award and Honor */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Award and Honor</h3>
      {professorData.awardandhonor?.map((item, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Award ${index + 1}`}
          value={item}
          onChange={(e) => {
            const newAwards = [...professorData.awardandhonor];
            newAwards[index] = e.target.value;
            setProfessorData({ ...professorData, awardandhonor: newAwards });
          }}
          className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
        />
      ))}
      <button
        type="button"
        onClick={() => handleArrayChange('awardandhonor', '')}
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Add Award
      </button>
    </div>
  
    {/* Membership */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Membership and Professional Society</h3>
      {professorData.membership?.map((item, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Membership ${index + 1}`}
          value={item}
          onChange={(e) => {
            const newMemberships = [...professorData.membership];
            newMemberships[index] = e.target.value;
            setProfessorData({ ...professorData, membership: newMemberships });
          }}
          className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
        />
      ))}
      <button
        type="button"
        onClick={() => handleArrayChange('membership', '')}
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Add Membership
      </button>
    </div>
  
    {/* Professional Services */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Professional Services</h3>
      {professorData.professionalservices?.map((item, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Service ${index + 1}`}
          value={item}
          onChange={(e) => {
            const newServices = [...professorData.professionalservices];
            newServices[index] = e.target.value;
            setProfessorData({ ...professorData, professionalservices: newServices });
          }}
          className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
        />
      ))}
      <button
        type="button"
        onClick={() => handleArrayChange('professionalservices', '')}
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Add Service
      </button>
    </div>
  
    {/* Funded Research Project */}
   {/* Funded Research Project */}
<div>
  <h3 className="mb-4 text-lg font-semibold text-gray-700">Funded Research Project</h3>
  {professorData.fundedresearchproject?.map((item, index) => (
    <input
      key={index}
      type="text"
      placeholder={`Project ${index + 1}`}
      value={item}
      onChange={(e) => {
        const newProjects = [...professorData.fundedresearchproject];
        newProjects[index] = e.target.value;
        setProfessorData(prevState => ({ ...prevState, fundedresearchproject: newProjects }));
      }}
      className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
    />
  ))}
  <button
    type="button"
    onClick={() => handleArrayChange('fundedresearchproject', '')}
    className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
  >
    Add Project
  </button>
</div>

{/* Training Attended */}
<div>
  <h3 className="mb-4 text-lg font-semibold text-gray-700">Training/Conferences/Short Term Courses Attended</h3>
  {professorData.trainingattended?.map((item, index) => (
    <div key={index} className="mb-2">
      <input
        type="text"
        placeholder="Training Attended (e.g., MAY 2017: 10 day Faculty Development Programme...)"
        value={item}
        onChange={(e) => {
          const newTrainings = [...professorData.trainingattended];
          newTrainings[index] = e.target.value;
          setProfessorData(prevState => ({ ...prevState, trainingattended: newTrainings }));
        }}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleArrayChange('trainingattended', '')}
    className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
  >
    Add Training Attended
  </button>
</div>


{/* Training Conducted */}
<div>
  <h3 className="mb-4 text-lg font-semibold text-gray-700">Training/Conferences/Short Term Courses Conducted</h3>
  {professorData.trainingConducted?.map((item, index) => (
    <div key={index} className="mb-2">
      <input
        type="text"
        placeholder="Training Conducted (e.g., MAY 2017: 10 day Faculty Development Programme...)"
        value={item}
        onChange={(e) => {
          const newConductedTrainings = [...professorData.trainingConducted];
          newConductedTrainings[index] = e.target.value;
          setProfessorData(prevState => ({ ...prevState, trainingConducted: newConductedTrainings }));
        }}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleArrayChange('trainingConducted', '')}
    className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
  >
    Add Training Conducted
  </button>
</div>


  
    <button
      type="submit"
      className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
    >
      Submit
    </button>
  </form>
  
  );
}
