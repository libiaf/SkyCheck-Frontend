import Dashboard from '../components/dashboard';
import WeatherWidgets from '../components/weatherWidgets.tsx';
import WindOverview from '../components/WindOverview.tsx';
import UVindice from '../components/UVindex.tsx';
import ReactDatePicker from '../components/datepicker';
import Alerts from '../components/Alerts';
import '../styles/principal.css';

const Principal = () => {
    return (
        <div> {/* mapa */}
            <div> {/* nav bar */}
                
            </div>
            <div> {/* content */} 
                <div> {/* left content, wet+date+hours */}
                    {/*<ReactDatePicker></ReactDatePicker>*/}
                    <div> {/* wet */}
                    
                    </div>
                    <div> {/* date + hours */}
                        <div> {/* date */}
                            <ReactDatePicker></ReactDatePicker>
                        </div>
                        <div> {/* hours */}

                        </div>
                    </div>
                </div>
                <div className="principal-container d-flex justify-content-end align-items-end">
                <Dashboard ciudad="Hermosillo" >
                    <Alerts
                    items={[
                        "Warning: High UV index expected.",
                        "Warning: Strong winds after 3 PM."
                    ]}
                    />
                    <WeatherWidgets />
                    <WindOverview velocity={15} direction={0} gusts={25} />
                    <UVindice uvIndex={8} level="High" />
                </Dashboard>
                </div>
            </div>
        </div>
    );
};

export default Principal;