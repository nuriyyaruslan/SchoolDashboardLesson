const Arrays = () => {

    const names: string[] = [];
    names.push("Dylan"); // no error
    //names.push(3); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.

    names.push('Nuriyya');


    // const names: readonly string[] = ["Dylan"];
    // names.push("Jack");

    const numbers = [1, 2, 3]; //inference
    // numbers.push('6');

    return ( 
        <div>
            <h4>Arrays</h4>
            {names}

            <p>
                {numbers}
            </p>
        </div>
     );
}
 
export default Arrays;