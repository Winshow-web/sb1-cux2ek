import { useState } from "react";

export default function DriverForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [elements, setElements] = useState<string[]>([]);
    const [newElement, setNewElement] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleAddElement = () => {
        if (newElement.trim()) {
            setElements([...elements, newElement.trim()]);
            setNewElement("");
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        // Handle the form submission logic
        console.log({
            name,
            email,
            licenseNumber,
            elements,
            file,
        });
        alert("Form submitted for approval!");
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Driver Form</h1>
            <div className="space-y-6">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter your email"
                    />
                </div>

                {/* License Number Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                    <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter your license number"
                    />
                </div>

                {/* Array Management */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Add Elements</label>
                    <div className="flex space-x-2 mt-1">
                        <input
                            type="text"
                            value={newElement}
                            onChange={(e) => setNewElement(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter an element"
                        />
                        <button
                            onClick={handleAddElement}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                        {elements.map((element, index) => (
                            <li key={index}>{element}</li>
                        ))}
                    </ul>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload File</label>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="mt-1 block w-full text-gray-500"
                    />
                    {file && (
                        <p className="mt-2 text-sm text-gray-500">
                            Uploaded: <strong>{file.name}</strong>
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                    >
                        Send for Approval
                    </button>
                </div>
            </div>
        </div>
    );
}
