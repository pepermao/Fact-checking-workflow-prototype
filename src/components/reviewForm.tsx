import React from "react"
import { useForm } from "react-hook-form"
import "../styles/form.css"

interface IFormInput {
  changeRequested: string
}

const ReviewForm = ({ send }) => {
  const { register, handleSubmit } = useForm<IFormInput>()

  const onSubmit = (data: IFormInput) => {
    console.log(data)
    send("REQUESTCHANGE", { changeRequested: data.changeRequested })
  }

  const onClick = () => {
    send("APPROVEPR")
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Request Changes</label>
        <input {...register("changeRequested")} />
        <input type="submit" />
        <label>or approve the pull request</label>
      </form>
      <button onClick={onClick}>Approve</button>
    </>
  )
}

export default ReviewForm
