import React from  "react";
import { useForm } from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/form.css";

const CreateForm = ({send}) => {
    const schema = yup.object({
        IssueName: yup.string().required(),
    });

    const { register, handleSubmit, formState:{ errors }} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        send('CREATEISSUE', {issueName: data.IssueName})
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Issue Name</label>
                <input {...register("IssueName")} />
                {errors.IssueName && <p>{errors.IssueName.message}</p>}
                <input type="submit" />
        </form>
    )
}

export default CreateForm;