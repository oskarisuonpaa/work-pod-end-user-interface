//Info
import "./Info.css";
import { useAuth } from "../AuthProvider";
import LinkButton from "../LinkButton";

const Info = () => {
    const {token} = useAuth();
return (
<div id="info" className="page-content">
<h1 className="page-title">Info - Workpod Reservation System</h1>
{!token && 
<p>Note: access is for authorized users only; log in using LAB/LUT credentials.
<LinkButton label="Login" to="/login-form" />
</p>
}
<p>To reserve a work pod, select a work pod from the workpods page, or search for an available work pod using the search page. You can view your reservations on the dashboard page.</p>
<p>To cancel a reservation, go to the dashboard page and select the reservation you want to cancel. Please cancel your reservation if you no longer need it to make it available for another user.</p>

</div>

)};

export default Info;