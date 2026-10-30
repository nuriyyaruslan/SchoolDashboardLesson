const SpecialTypes = () => {

    //any, unknown, never

    let x: any = 10; //number
    x = 'lorem' //string

    //unknown

    function processValue(value: unknown) {
        if (typeof value === 'string') {
            // value is now treated as string
            console.log(value.toUpperCase());
        } else if (Array.isArray(value)) {
            // value is now treated as any[]
            console.log(value.length);
        }
    }

    console.log(processValue('nargiz'));

    let y;
    console.log('Y type is ' + typeof(y));  //undefined

    let z = null;
    console.log('Z type is ' + typeof(z));  //object

    return (
        <div>
            <p>{x}</p>
        </div>
    );
}

export default SpecialTypes;