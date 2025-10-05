import Dashboard from '../components/dashboard';
import WindOverview from '../components/WindOverview';
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
                            
                        </div>
                        <div> {/* hours */}

                        </div>
                    </div>
                </div>
                <div className="principal-container d-flex justify-content-end align-items-end">
                <Dashboard ciudad="Hermosillo" >
                    
                </Dashboard>
                </div>
            </div>
        </div>
    );
};

export default Principal;