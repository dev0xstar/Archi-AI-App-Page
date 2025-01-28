import { DropzoneOptions, useDropzone } from 'react-dropzone';

export const UIDropZone = () => {
  const onDrop = (acceptedFiles: DropzoneOptions['onDrop']) => {
    // Handle file logic here
    console.log(acceptedFiles);
  };

  // @ts-expect-error bcs of dropzoneOptions
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 border-gray-300 py-12 px-4 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-gray-700 mb-3">Attach</p>
      <p className="text-gray-500">
        {isDragActive ? (
          <span>Drop the files here ...</span>
        ) : (
          <span>
            Drag & Drop your files or <span className="text-blue-600 underline">Browse</span>
          </span>
        )}
      </p>
    </div>
  );
};
