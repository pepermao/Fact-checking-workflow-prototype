import React from  "react";
import { useForm } from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/form.css";

const OpenPullForm = ({send}) => {
    const schema = yup.object({
        prTitle: yup.string().required()
    })


    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });
    
    const onSubmit = (data) => {
        send("OPENPR", { prTitle: data.prTitle })
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Open Pull Request</label>
                <input {...register("prTitle")} />
                {errors.prTitle && <p>{errors.prTitle.message}</p>}
                <input type="submit" />
        </form>
    )
}

export default OpenPullForm;