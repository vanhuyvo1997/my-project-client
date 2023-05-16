import Layout from "@my-project/components/layout/layout";
import SignInAndUpFrom from "@my-project/components/sign-in-and-out/sign-in-up-form";
import TextInput from "@my-project/components/text-input/text-input";
import { useRouter } from "next/router";
import { TextInputType } from "@my-project/components/text-input/text-input";
import { useState } from "react"; 
import { NotifyType } from "@my-project/components/notification/notification";

import { isValidName, isValidEmail, isValidPassword } from "@my-project/util/validate-utils";
import { ContainerSize } from "@my-project/components/page-container/page-container";

export default function SignUp() {
  const [validationErrs, setValidationErrs] = useState({});
  const [notifications, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const router = useRouter();

  function navigateToRegister() {
    router.push("/sign-in");
  }

  async function handleSubmit(e) {
    //prevent submit form
    e.preventDefault();
    //Show loading
    setIsLoading(true);    
    //Get data from submit form

    //  errors 
    let validateErrsContainer = {};

    // validations
    if(!isValidName(name)){
        validateErrsContainer = {...validateErrsContainer, name : 'Name is required'};
    }
    if(!isValidEmail(username)){
        validateErrsContainer = {...validateErrsContainer, username : 'Email is invalid'};
    }
    if(!isValidPassword(password)){
        validateErrsContainer = {...validateErrsContainer, password : 'Password is invalid'};
    }
    if(isValidPassword(password) && password !== confirmedPassword){
        validateErrsContainer = {...validateErrsContainer, confirmedPassword : 'Confirmed password is not match'};
    }

    //update errors to show validation messages
    setValidationErrs(validateErrsContainer);

    // submit
    if(Object.keys(validateErrsContainer).length === 0){
      try{
          const url = "http://localhost:8080/api/auth/register";  
          let response = await fetch(url, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              username: username,
              password: password,
            }),
          });

          if(response.ok){
            notifications.push({type: NotifyType.SUCCESS, message: "Register successfully.", onDelete: (e)=> onDeleteNotifycation(e),});
            resetData();
          } else {
            notifications.push ({type: NotifyType.FAIL, message: "Email is already in use.", onDelete: (e) => onDeleteNotifycation(e),});
          }
        } catch(err){
          notifications.push({type: NotifyType.FAIL, message: "Failed to connect to server.", onDelete: (e) => onDeleteNotifycation(e),});
        }
      }
    setIsLoading(false);
  }

  function resetData(){
    setName('');
    setPassword('');
    setConfirmedPassword('');
    setUsername('');
  }

  function onDeleteNotifycation(notification){
    const index = notifications.indexOf(notification);
    if(index > -1){
      notifications.splice(index, 1);
    }
    setNotification([...notifications]);
  }




  return (
    <Layout
      navBarButtonContent="Sign in"
      onClickCornerButton={navigateToRegister}
      isLoading={isLoading}
      notifications={notifications}
      containerSize={ContainerSize.SMALL}
    >
      <div className="sign-in-and-up-container">
        <SignInAndUpFrom
          onSubmit={handleSubmit}
          title="Sign up your new account"
          nextButtonContent="Sign up"
          backButtonContent="To sign in"
          onClickBack={navigateToRegister}
        >
          <TextInput
            value={name}
            name="name"
            type={TextInputType.ORANGE}
            iconSrc="/images/name-icon.png"
            placeholder="Your name"
            error={validationErrs.name}
            onChange={e=>setName( e.target.value)}
          />
          <TextInput
            value={username}
            name="username"
            type={TextInputType.ORANGE}
            iconSrc="/images/username-icon.png"
            placeholder="Your email"
            error={validationErrs.username}
            onChange={e=>setUsername( e.target.value)}
          />
          <TextInput
            value={password}
            name="password"
            type={TextInputType.ORANGE}
            password
            iconSrc="/images/password-icon.png"
            placeholder="Your password"
            error={validationErrs.password}
            onChange={e=>setPassword( e.target.value)}
          />
          <TextInput
            value={confirmedPassword}
            name="confirmedPassword"
            type={TextInputType.ORANGE}
            password
            iconSrc="/images/password-icon.png"
            placeholder="Confirm your password"
            error={validationErrs.confirmedPassword}
            onChange={e=>setConfirmedPassword(e.target.value)}
          />
          <div>
            <small>
              Password must contain:
              <ul>
                <li>at least 8 characters</li>
                <li>at least 1 number</li>
                <li>at least 1 special character (@$!%*#?&) </li>
              </ul>
            </small>
          </div>
        </SignInAndUpFrom>
      </div>
    </Layout>
  );
}
