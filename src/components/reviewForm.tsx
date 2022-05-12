import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/form.css";

interface IFormInput {
  changeRequested: string;
}

const ReviewForm = ({ send }) => {
  const schema = yup.object({
    changeRequested: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInput) => {
    console.log(data);
    send('REQUESTCHANGE', {changeRequested: data.changeRequested})
  };

  const onClick = () => {
    console.log("mergeado");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Request Changes</label>
      <input {...register("changeRequested")} />
      <input type="submit" />
      <label>or approve the pull request</label>      
      <button onClick={onClick}>Approve</button>
    </form>
  );
};

export default ReviewForm;
