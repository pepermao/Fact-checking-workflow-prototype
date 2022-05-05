import React from  "react";
import { useForm } from "react-hook-form";
import "../styles/form.css";

const AssignedForm = ({send}) => {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        send('ASSIGNDEV', {devName: data.assignedDev})
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Issue Assigning</label>
                <select {...register("assignedDev")}>
                    <option value="Vitor">Vitor</option>
                    <option value="Joao">Joao</option>
                    <option value="Thais">Thais</option>
                    <option value="Karen">Karen</option>
                </select>
                <input type="submit" />
        </form>
    )
}

export default AssignedForm;