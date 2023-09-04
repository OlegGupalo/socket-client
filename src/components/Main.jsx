import { useState } from 'react'
import styles from '../styles/Main.module.css'
import { Link } from 'react-router-dom'

const Main = () => {

    const [values, setValues] = useState({ name: "", room: "" })

    const handleChange = ({ target: {value, name} }) => {
        setValues({...values, [name]: value})
    }

    const handleClick = (e) => {
        const isDisabled = Object.values(values).some(value => !value)

        if(isDisabled) e.preventDefault()
    }

    return <div className={styles.wrap}>
        <div className={styles.container}>
            <h1 className={styles.heading}>Заполните</h1>
            <form className={styles.form}>
                <div className={styles.group}>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Имя"
                        autoComplete="off"
                        value={values.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.group}>
                    <input 
                        type="text"
                        name="room"
                        placeholder="Комната"
                        autoComplete="off"
                        value={values.room}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Link 
                    to={`/chat?name=${values.name}&room=${values.room}`} 
                    onClick={handleClick}
                    className={styles.group}>
                    <button type="submit" className={styles.button}>
                        Войти
                    </button>
                </Link>
            </form>
        </div>
    </div>
}

export default Main