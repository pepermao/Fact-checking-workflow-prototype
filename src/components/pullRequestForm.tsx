import React from  "react";
import { useForm } from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/form.css";

interface IFormInputs {
    prTitle: string;
}

const OpenPullForm = ({ send }) => {
    const schema = yup.object({
        prTitle: yup.string().required()
    })


    const { register, handleSubmit, formState:{ errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema)
    });
    
    const onSubmit = (data: IFormInputs) => {
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