import { useAuth } from "../context/AuthContext" //Para renderizado condicional. Con y/o sin log
import InputGroup from "../components/ui/InputGroup"

function SearchPage() {

    const { user } = useAuth()

    return (
        <div>
            <p>¿Qúe quieres buscar? <strong>{user?.firstname}</strong></p>

            <InputGroup
            />
        </div>
    )
}

export default SearchPage