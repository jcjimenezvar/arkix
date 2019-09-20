import { buildProviderModule, container } from './inversify.config'

/* REST Controllers */
import '../../routes/arkix/arkix.controller'

/* Services */
import '../../services/arkixService/arkixService'
import '../../services/dbService/dbService'

container.load(buildProviderModule())
