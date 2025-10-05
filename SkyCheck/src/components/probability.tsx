import '../styles/probability.css'
import icon from '../assets/iconProbability.png'

interface Props {
    hot: number;
    cold: number;
    humidity: number;
    rain: number;
    wind: number;
    uv: number;
}

const Probability = ({hot,cold,humidity,rain,wind,uv}: Props) => {
    return (
        <div id = 'mainbox'>
            <div id = 'title'> 
                <img src={icon}/>
                <h1>Probability Check</h1>
            </div>
        
            <div id = 'databox'>
                <div id = 'left'>
                    <div className='bar'>
                        <p>Very hot</p>
                        <div className='bar-track'>
                            <div className='bar-fill-hot' style={{ width: `${hot}%` }}>
                            <span className='bar-text-hot'>{hot}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='bar'>
                        <p>Very cold</p>
                        <div className='bar-track'>
                            <div className='bar-fill-cold' style={{ width: `${cold}%` }}>
                            <span className='bar-text-cold'>{cold}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='bar'>
                        <p>Very humid</p>
                        <div className='bar-track'>
                            <div className='bar-fill-humidity' style={{ width: `${humidity}%` }}>
                            <span className='bar-text-humidity'>{humidity}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id = 'right'>
                    <div className='bar'>
                        <p>Extreme rain</p>
                        <div className='bar-track'>
                            <div className='bar-fill-rain' style={{ width: `${rain}%` }}>
                            <span className='bar-text-rain'>{rain}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='bar'>
                        <p>Extreme wind</p>
                        <div className='bar-track'>
                            <div className='bar-fill-wind' style={{ width: `${wind}%` }}>
                            <span className='bar-text-wind'>{wind}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='bar'>
                        <p>Dangerous UV</p>
                        <div className='bar-track'>
                            <div className='bar-fill-uv' style={{ width: `${uv}%` }}>
                            <span className='bar-text-uv'>{uv}%</span>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    );
};

export default Probability;