const Objects = () => {

    // const car: { type: string, model: string, year: number} = {
    //     type: "Toyota",
    //     model: "Corolla",
    //     year: 2009
    // };

    const car: { type: string, mileage?: number } = { // no error
        type: "Toyota"
    };
    car.mileage = 2000;

    return (
        <div>
            <h4>Objects</h4>
            <p>
                {
                    // car.type + ' ' +  car.model + ' ' + car.year
                    car.type + ' ' + car.mileage
                }
            </p>
        </div>
     );
}
 
export default Objects;