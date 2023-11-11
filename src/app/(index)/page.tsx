import UploadContainer from "../ui/UploadContainer";

function HomePage() {
  return (
    <>
      <main>
        <div className='content'>
          <div className='ui-card p-8 rounded-lg shadow-lg bg-slate-100 mt-6'>
            <UploadContainer />
          </div>
        </div>
      </main>
      <footer>
        <div className='content'></div>
      </footer>
    </>
  );
}

export default HomePage;
