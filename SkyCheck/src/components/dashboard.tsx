import '../styles/dashboard.css';

interface Props {
  ciudad: string;
  children?: React.ReactNode;
}

const Dashboard = ({ ciudad, children }: Props) => {
  return (
    <div className="panel glass shadow-lg p-4">
      <h1 className="title">{ciudad}</h1>

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default Dashboard;

