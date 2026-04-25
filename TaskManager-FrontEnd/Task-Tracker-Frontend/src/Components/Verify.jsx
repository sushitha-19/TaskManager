import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        navigate("/"); // go to login after verification
      })
      .catch(() => {
        alert("Verification failed");
      });

  }, []);

  return <h2>Verifying your email...</h2>;
}

export default Verify;