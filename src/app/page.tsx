import UploadContainer from "./ui/UploadContainer";

function HomePage() {
  return (
    <>
      <header>
        <div className='content'>
          <div>logo</div>
          <nav>
            <p>Home</p>
            <p>About</p>
            <p>Others</p>
            <p>Contribute</p>
          </nav>
        </div>
      </header>
      <main>
        <div className='content space-y-4'>
          <h1>
            File sharer. The quickest way to share images with friends and
            family.
          </h1>
          <UploadContainer />
        </div>
      </main>
      <footer>
        <div className='content'></div>
      </footer>
    </>
  );
}

export default HomePage;
