const SimpleTypes = () => {

    let isActive: boolean = true;
    let hasPermission = false; // TypeScript infers 'boolean' type

    let float: number = 3.14;      
    float = 12;

    // const PI: number = 3.14;

    let color: string = "blue";
    let fullName: string = 'John Doe';
    let age: number = 30;
    let sentence: string = `Hello, my name is ${fullName} and I'll be ${age + 1} next year.`;

    const hugeNumber = BigInt(9007199254740991);

    const userName: symbol = Symbol('description');
    const obj = {
    [userName]: 'This is a unique property'
    };
    console.log(obj[userName]); // "This is a unique property"

    return ( 
        <div>
            <h4>Simple Types</h4>
            <div>
                {
                    isActive ? <p>Active</p> : <p>Deactive</p>
                }
                {
                    hasPermission ? <p>Yes Permission</p> : <p>No Permission</p>
                }

                {
                    <strong>{float}</strong>
                }
            </div>

            <ul>
                <li>color: {color}</li>
                <li>fullName: {fullName}</li>
                <li>age: {age}</li>
                <li>{sentence}</li>
            </ul>

            <p>Hugenumber: {hugeNumber}</p>
        </div>
     );
}
 
export default SimpleTypes;