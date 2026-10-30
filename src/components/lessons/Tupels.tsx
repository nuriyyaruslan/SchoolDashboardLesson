const Tupels = () => {

    // define our tuple
    let ourTuple: [number, boolean, string];

    // initialize correctly
    ourTuple = [5, false, 'Coding God was here'];

    return ( 
        <div>
            <h4>Tupels</h4>
            {ourTuple}
        </div>
     );
}
 
export default Tupels;