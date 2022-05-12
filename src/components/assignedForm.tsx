import React from  "react";
import { useForm } from "react-hook-form";
import "../styles/form.css";

enum DevEnum {
    Vitor = "Vitor",
    Joao = "Joao",
    Thais = "Thais",
    Karen = "Karen"
} 

interface IFormIput {
    assignedDev: DevEnum;
}

const AssignedForm = ({send}) => {
    const { register, handleSubmit } = useForm<IFormIput>();

    const onSubmit = (data: IFormIput) => {
        send('ASSIGNDEV', {devName: data.assignedDev})
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Issue Assigning</label>
                <select {...register("assignedDev")}>
                    <option value="Vitor">Vitor</option>
                    <option value="Joao==">Joao</option>
                    <option value="Thais">Thais</option>
                    <option value="Karen">Karen</option>
                </select>
                <input type="submit" />
        </form>
    )
}

export default AssignedForm;