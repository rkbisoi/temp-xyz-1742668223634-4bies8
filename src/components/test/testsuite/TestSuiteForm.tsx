import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Step1 from './Step1';
// import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';
import { TestCase, TestSuite } from '../types';
import { createCustomTestSuite } from '../../../services/testsuiteService';

interface TestSuiteFormProps {
    testSuites: TestSuite[]
    projectId: number;
    // onSubmit: (data: any) => void;
    onClose: () => void;
}
export type TestSuiteFormData = {
    project_id: number;
    name: string;
    description: string;
    // testScript: File | null;
    test_cases: Set<number>;
};

// function filterTestCases(testSuites: any, testCaseIds:any) {
//     return testSuites.flatMap((suite:any) => 
//         suite.testCases
//             .filter((tc:any) => testCaseIds.has(tc.id))
//             .map(({ id, suiteId, status, createdBy, updatedBy, createdAt, updatedAt, ...rest }) => rest)
//     );
// }


function filterTestCases(testSuites: TestSuite[], testCaseIds: Set<number>): Omit<TestCase, 'id' | 'suiteId' | 'status' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'>[] {
    return testSuites.flatMap(suite =>
        suite.testCases
            .filter(testCase => testCaseIds.has(testCase.id))
            .map(({ id, suiteId, status, createdBy, updatedBy, createdAt, updatedAt, ...rest }) => rest)
    );
}


const TestSuiteForm: React.FC<TestSuiteFormProps> = ({ projectId, testSuites, onClose }) => {
    // console.log("ProjectId : ", projectId, " testSuites : ", testSuites)
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<TestSuiteFormData>({
        project_id: projectId,
        name: '',
        description: '',
        // testScript: null as File | null,
        test_cases: new Set<number>(),
    });

    // const handleNext = () => setStep((prev) => prev + 1);
    const handleNext = () => setStep((prev) => prev + 2);
    const handlePrev = () => setStep((prev) => prev - 2);

    const handleSetFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    // const handleSubmit = () => {
    //     if (!formData.project_id || !formData.name || !formData.description || !formData.testScript) {
    //         toast.error('Please complete all required fields.');
    //         return;
    //     }
    //     onSubmit({
    //         project_id: formData.project_id,
    //         name: formData.name,
    //         description: formData.description,
    //         testScript: formData.testScript,
    //         isCustom: false,
    //         test_cases: Array.from(formData.test_cases),
    //     });
    //     onClose();
    // };

    const handleSubmit = async () => {
        if (!formData.project_id || !formData.name) {
            toast.error('Please complete all required fields.');
            return;
        }
        const newTestSuite = {
            project_id: formData.project_id,
            name: formData.name,
            description: formData.description,
            // testScript: "",
            isCustom: true,
            test_cases: filterTestCases(testSuites, formData.test_cases),
        }
        console.log("Created Test Suite : ", newTestSuite)
        // onSubmit(newTestSuite);

        const response = await createCustomTestSuite(newTestSuite)

        if (response.success) {
            toast.success("Custom Test Suite Created Successfully!");
            onClose();
        }else{
            toast.error("Error Creating Custom Test Suite")
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg w-full max-w-xl p-1 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-intelQEDarkBlue"
                >
                    <X className="w-5 h-5" />
                </button>
                {step === 1 && <Step1 formData={formData} setFormData={handleSetFormData} nextStep={handleNext} />}
                {/* {step === 2 && <Step2 formData={formData} setFormData={handleSetFormData} prevStep={handlePrev} nextStep={handleNext} />} */}
                {step === 3 && (
                    <Step3
                        formData={formData}
                        testSuites={testSuites}
                        selectedTestCases={formData.test_cases}
                        setSelectedTestCases={(newSelected) =>
                            setFormData(prev => ({ ...prev, test_cases: newSelected }))
                        }
                        prevStep={handlePrev}
                        submitForm={handleSubmit}
                    />
                )}

            </div>
        </div>
    );
};

export default TestSuiteForm;
