import Dashboard from '../components/dashboard';
import '../styles/principal.css';

const Principal = () => {
    return (
        <div className="principal-container d-flex justify-content-end align-items-end">
            <Dashboard ciudad="Hermosillo" >
            </Dashboard>
        </div>
    );
};

export default Principal;
