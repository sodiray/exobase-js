// IMPORT
import { useService } from './useServices'
import { useCors } from './useCors'
import { 
    useJsonArgs, 
    useQueryArgs, 
    useHeaderArgs,
} from './useValidation'

// EXPORT
export { useService } from './useServices'
export { useCors } from './useCors'
export { 
    useJsonArgs, 
    useQueryArgs, 
    useHeaderArgs,
} from './useValidation'

export default {
    useCors,
    useService,
    useJsonArgs,
    useQueryArgs,
    useHeaderArgs
}