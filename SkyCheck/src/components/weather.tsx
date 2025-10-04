import '../styles/weather.css'

interface Props {
    description : string;
    icon : string; /* url */
    degrees : number;
    high : number;
    low : number;
}

const Weather = ({description, icon, degrees, high, low}: Props) => {
    return (
        <div className = 'block'>
            <p>{description}</p>
            <div id = 'degreesBox'>
                <img src={icon}/>
                <h1>{degrees}°</h1>
            </div>
            <div id = 'HL'>
                <p id='H'>H: {high}°</p>
                <p>L: {low}°</p>
            </div>
        </div>
    );
};

export default Weather;