const ExplicitInference = () => {
    
    let greeting:number; //explicit
    greeting = 10; //number
    // greeting = 'string' //string

    function greet(age: number): string {
        return `Hello, ${age}!`;
    }

    console.log(greet(32)); //output type: string

    return ( 
        <div>
            <h4>Explicit Inference</h4>
            <p>{greeting}</p>
        </div>
     );
}
 
export default ExplicitInference;