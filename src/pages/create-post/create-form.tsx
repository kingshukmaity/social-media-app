import {useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import {addDoc, collection} from "firebase/firestore"
import { auth, dataBase } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom"

interface createFormType {
    title: string;
    description: string;
}

export const CreateForm = () => {
    const [user] = useAuthState(auth)
    const schema = yup.object().shape({
        title: yup.string().required("You must add a title"),
        description: yup.string().required("You must add a description"),
    })

    const { register, handleSubmit, formState: {errors}, } = useForm <createFormType>({
        resolver: yupResolver(schema),
    })

    const postRef = collection(dataBase, "posts")

    const onCreatePost = async (data: createFormType) => {
        await addDoc(postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
        })
    }
    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit(onCreatePost)}> 
                <input placeholder="Title..." {...register("title")} />
                <p className="error" style={{color: "red"}}>{errors.title?.message}</p>
                
                <textarea placeholder="Description..." {...register("description")} />
                <p className="error" style={{color: "red"}}>{errors.description?.message}</p>
                
                <Link to="/"><input className="submit" type="submit" /></Link>
            </form>
        </div>
    )
}