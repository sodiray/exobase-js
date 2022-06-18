// IMPORT
import { useService } from './useServices'
import { useCors } from './useCors'
import { 
    useValidation,
    useJsonArgs, 
    useQueryArgs, 
    useHeaderArgs,
} from './useValidation'

// EXPORT
export { useService } from './useServices'
export { useCors } from './useCors'
export {
    useValidation,
    useJsonArgs, 
    useQueryArgs, 
    useHeaderArgs,
} from './useValidation'

export default {
    useCors,
    useService,
    useJsonArgs,
    useQueryArgs,
    useHeaderArgs,
    useValidation
}