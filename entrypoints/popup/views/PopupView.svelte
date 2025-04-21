<div>
    {authFacade.isAuthenticated ? 'auth' : 'not auth'}
</div>

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';

const authFacade = Container.get(AuthFacade);
</script>
