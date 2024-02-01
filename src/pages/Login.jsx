import LoginForm from '../components/loginPage/LoginForm.jsx'
const Login = () => {
    return <>
    <div className="login-body">
    <div className="container">
	<div className="screen">
		<div className="screen__content">
			<LoginForm></LoginForm>
		</div>
		<div className="screen__background">
			<span className="screen__background__shape screen__background__shape4"></span>
			<span className="screen__background__shape screen__background__shape3"></span>		
			<span className="screen__background__shape screen__background__shape2"></span>
			<span className="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>
</div>

    </>
  }
  export default Login