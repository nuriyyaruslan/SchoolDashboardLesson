import './App.css'
import Objects from './components/lessons/Objects';
import Tupels from './components/lessons/Tupels';
import Arrays from './components/lessons/Arrays';
// import SpecialTypes from './components/lessons/SpecialTypes';
// import ExplicitInference from './components/lessons/ExplicitInference';
// import SimpleTypes from './components/lessons/SimpleTypes';

function App() {
  return (
    <>
     <section>
      {/* <SimpleTypes/> */}
      {/* <ExplicitInference/> */}
      {/* <SpecialTypes/> */}
      <Arrays/>
      <Tupels/>
      <Objects/>
     </section>
    </>
  )
}

export default App;
