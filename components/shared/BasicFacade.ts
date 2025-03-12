import {
    type Constructable,
    Container,
    type ContainerInstance,
    type ServiceIdentifier,
    type ServiceOptions
} from 'typedi';

type FacadeType = Constructable<unknown> & { instance: unknown };
export type FacadeProvider = Constructable<unknown> | ServiceOptions;

export class BasicFacade {
    static _instance: unknown;
    static container: ContainerInstance = Container as unknown as ContainerInstance;
    static providers: FacadeProvider[] = [];

    static get instance(): any {
        if (!this._instance) {
            this.container.set(this._buildProviders());
            this._instance = this.container.get(this);
        }

        return this._instance;
    }

    static _buildProviders(): ServiceOptions[] {
        const facadeProvider: ServiceOptions = { id: this, type: this };

        return this.providers.concat(facadeProvider).map((provider) => {
            if (typeof provider === 'function') {
                return this._buildClassProvider(provider);
            }

            return provider;
        });
    }

    static _buildClassProvider(provider: ServiceOptions | ServiceIdentifier): ServiceOptions {
        if (this._isFacadeProvider(provider)) {
            return { id: provider as ServiceIdentifier, factory: () => provider.instance };
        }

        return { id: provider as ServiceIdentifier, type: provider as Constructable<unknown> };
    }

    static _isFacadeProvider(provider: ServiceOptions | ServiceIdentifier): provider is FacadeType {
        return 'instance' in (provider as FacadeType);
    }
}
