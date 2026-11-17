// A functional component = JS functions that return JSX-elements

const HomePage = () => {
    return (
        <div className="text-center">
            <h1 className="display-4">Study Buddy - My Courses</h1>
        </div>
    );
};

export default HomePage; // when another file import from this modul, they get these components by default