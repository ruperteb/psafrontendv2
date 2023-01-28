import React, { memo, useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Mutation, MutationLoginArgs } from "../../src/schematypes/schematypes";
import {
  TextField,
  ITextFieldStyles,
} from "office-ui-fabric-react/lib/TextField";
import { AUTH_TOKEN } from "../constants";
import { Image, IImageProps, ImageFit } from "office-ui-fabric-react/lib/Image";
import HeaderImage from "../assets/EBLogoHeader.png";
import { IStackStyles, Stack } from "office-ui-fabric-react/lib/Stack";
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Text,
  DefaultButton,
  IButtonStyles,
  PrimaryButton,
  IconButton,
  IIconProps,
} from "office-ui-fabric-react";

import Loading from "./Loading";
import { AuthContext } from "../AuthContext";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

type LoginDetails = {
  email: string | undefined;
  password: string | undefined;
};

interface Props {}

const headerStackStyles: Partial<IStackStyles> = {
  root: { width: "100vw", backgroundColor: "#20314b", marginBottom: "10px" },
};
const headerImageStyles: Partial<IStackStyles> = {
  root: { marginLeft: "auto", marginRight: "auto" },
};
const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: { width: 250 },
};
const textErrorStyles: Partial<ITextFieldStyles> = {
  root: { color: "red", marginBottom: 10 },
};
const primaryButtonStyles: Partial<IButtonStyles> = {
  root: { /* width: 150, */ marginTop: "20px !important" },
};
const signInIcon: IIconProps = { iconName: "SignIn" };

const imageProps: IImageProps = {
  src: HeaderImage,
  imageFit: ImageFit.contain,
};

export const Login: React.FC<Props> = ({}) => {
  const { setAuthorised, setToken, authorised, token } =
    useContext(AuthContext);

  const [loginMutation, { data, error, loading }] = useMutation<
    Mutation,
    MutationLoginArgs
  >(LOGIN_MUTATION, {
    onCompleted({ login }) {
      localStorage.setItem("token", login!.token as string);
      /* setLogin({ ...login, login: false }); */
      if (login?.token) {
        setAuthorised(true);

        setToken(login.token);
      }
    },
    errorPolicy: "none",
  });

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: undefined,
    password: undefined,
  });

  const onChangeEmail = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue: string | undefined
    ) => {
      setLoginDetails({ ...loginDetails, email: newValue });
    },
    [loginDetails]
  );

  const onChangePassword = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue: string | undefined
    ) => {
      setLoginDetails({ ...loginDetails, password: newValue });
    },
    [loginDetails]
  );

  const loginCallback = () => {
    loginMutation({
      variables: {
        email: loginDetails.email!,
        password: loginDetails.password!,
      },
    });
  };

  if (error) {
    error.graphQLErrors.map((error) => {
      console.log(error.message);
    });
  }
  if (loading) return <Loading></Loading>;
  if (error)
    return (
      <Stack
        horizontalAlign="center"
        verticalAlign="start"
        verticalFill
        styles={{
          root: {
            /*  width: '960px', */
            margin: "0 auto",
            textAlign: "center",
            color: "#605e5c",
            /* backgroundColor: "rgba(177, 140, 72, 0.1);" */
          },
        }}
        gap={15}
      >
        <Stack styles={headerStackStyles} horizontal>
          <Image
            {...imageProps}
            alt="Header Image"
            width={400}
            height={100}
            styles={headerImageStyles}
          />
        </Stack>

        <Stack
          horizontalAlign="center"
          verticalAlign="start"
          styles={{
            root: {
              /*  width: '960px', */
              margin: "0 auto",
              textAlign: "center",
              color: "white",
              backgroundColor: "white",
              border: "1px solid rgb(138, 136, 134)",
              boxShadow: "2px 3px 11px 7px #00000026",
              padding: "30px",
              marginTop: "75px !important",
            },
          }}
        >
          <Text styles={textErrorStyles}>Incorrect username or password</Text>
          <TextField
            label="Email"
            value={loginDetails.email}
            onChange={onChangeEmail}
            styles={textFieldStyles}
          />

          <TextField
            label="Password"
            value={loginDetails.password}
            onChange={onChangePassword}
            styles={textFieldStyles}
          />

          <PrimaryButton
            styles={primaryButtonStyles}
            iconProps={signInIcon}
            text="Sign In"
            onClick={loginCallback}
          />
        </Stack>
      </Stack>
    );

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="start"
      verticalFill
      styles={{
        root: {
          /*  width: '960px', */
          margin: "0 auto",
          textAlign: "center",
          color: "#605e5c",
          /* backgroundColor: "rgba(177, 140, 72, 0.1);" */
        },
      }}
      gap={15}
    >
      <Stack styles={headerStackStyles} horizontal>
        <Image
          {...imageProps}
          alt="Header Image"
          width={400}
          height={100}
          styles={headerImageStyles}
        />
      </Stack>

      <Stack
        horizontalAlign="center"
        verticalAlign="start"
        styles={{
          root: {
            /*  width: '960px', */
            margin: "0 auto",
            textAlign: "center",
            color: "white",
            backgroundColor: "white",
            border: "1px solid rgb(138, 136, 134)",
            boxShadow: "2px 3px 11px 7px #00000026",
            padding: "30px",
            marginTop: "75px !important",
          },
        }}
      >
        <TextField
          label="Email"
          value={loginDetails.email}
          onChange={onChangeEmail}
          styles={textFieldStyles}
        />

        <TextField
          label="Password"
          value={loginDetails.password}
          onChange={onChangePassword}
          styles={textFieldStyles}
        />

        <PrimaryButton
          styles={primaryButtonStyles}
          iconProps={signInIcon}
          text="Sign In"
          onClick={loginCallback}
        />
      </Stack>
    </Stack>
  );
};

export default Login;
