import React from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';

type FormData = {
  name: string;
  description: string;
  type: string;
};

type AddApplicationFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddApplicationForm: React.FC<AddApplicationFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    description: '',
    type: '',
  });

  const handleSetFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const submitForm = () => {
    console.log('Form Submitted:', formData);
    alert('Form Submitted Successfully!');
    onClose();
    setStep(1); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-4 rounded-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-intelQEDarkBlue"
        >
          <X className="w-5 h-5"/>
        </button>
        <h1 className="title1 items-center text-center">Add Application</h1>
        {step === 1 && (
          <Step1 formData={formData} setFormData={handleSetFormData} nextStep={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={handleSetFormData}
            prevStep={() => setStep(1)}
            nextStep={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={handleSetFormData}
            prevStep={() => setStep(2)}
            submitForm={submitForm}
          />
        )}
      </div>
    </div>
  );
};

export default AddApplicationForm;
