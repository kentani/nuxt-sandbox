import { InjectionKey } from '@nuxtjs/composition-api';
import { AuthStoreType } from './use-auth';

const AuthStoreKey: InjectionKey<AuthStoreType> = Symbol('AuthStoreType');
export default AuthStoreKey;
