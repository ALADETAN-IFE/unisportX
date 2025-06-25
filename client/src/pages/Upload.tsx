const Upload = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Upload a Video</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" className="mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">Faculty</label>
          <select id="faculty" className="mt-1 block w-full">
            <option>Engineering</option>
            <option>Science</option>
            <option>Arts</option>
            {/* Add more faculties as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video File</label>
          <input type="file" id="video" className="mt-1 block w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  );
};

export default Upload; 