/**
 * @author Pedro Sanders
 * @since v1
 *
 * Unit Test for the "Resources Module"
 */
import ResourcesUtil from 'resources/utils'
import AgentsAPI from 'resources/agents_api'
import GatewaysAPI from 'resources/gateways_api'
import DomainsAPI from 'resources/domains_api'
import DIDsAPI from 'resources/dids_api'
import UsersAPI from 'resources/users_api'
import { Status } from 'resources/status'

export let testGroup = { name: "Resources Module" }

const rUtil = new ResourcesUtil()
const agentsApi = new AgentsAPI()
const gwsAPI = new GatewaysAPI()
const domainsAPI = new DomainsAPI()
const didsAPI = new DIDsAPI()
const usersAPI = new UsersAPI()
const SipFactory = Packages.javax.sip.SipFactory
const addressFactory = SipFactory.getInstance().createAddressFactory()

// Tests
testGroup.is_jason = function () {
    assertTrue(rUtil.isJson("{}"))
    assertFalse(rUtil.isJson(""))
}

testGroup.yaml_from_file = function () {
    const jsonObj = rUtil.getJsonString('config/agents.yml')
    assertTrue(rUtil.isJson(jsonObj))
}

testGroup.validate_resource = function () {
    const valid = rUtil.isResourceValid('etc/schemas/agents_schema.json', 'config/agents.yml')
    assertTrue(valid)
}

testGroup.get_objs = function () {
    let result = rUtil.getObjs('config/agents.yml')
    assertTrue(result.status == Status.OK)
    // Existing Agent
    result = rUtil.getObjs('config/agents.yml', "@.spec.credentials.username=='1001'")
    assertTrue(result.status == Status.OK)
    // Non-Existing Agent
    result = rUtil.getObjs('config/agents.yml', "@.spec.credentials.username=='peter'")
    assertTrue(result.status == Status.NOT_FOUND)
    // Invalid filter
    result = rUtil.getObjs('config/agents.yml', "@.spec.credentials.username==mike'")
    assertTrue(result.status == Status.BAD_REQUEST)
}

// This also validates the other resources
testGroup.get_agents = function () {
    // NOTE: The space will not work in the console because is considered another parameter
    const result = agentsApi.getAgents("@.spec.credentials.username=='1001' || @.spec.credentials.username=='1002'")
    assertTrue(result.status == Status.OK)
    assertTrue(result.obj.length == 2)
}

// This also validates the other resources
testGroup.get_agent_by_ref = function () {
    const result = agentsApi.getAgentByRef('ag3f77f6')
    assertTrue(result.status == Status.OK)
    assertTrue(result.obj.kind == 'Agent')
}

// This also validates the other resources
testGroup.get_gw_by_ref = function () {
    const result = gwsAPI.getGateway('gweef506')
    assertTrue(result.status == Status.OK)
    assertTrue(result.obj.kind == 'Gateway')
}

// This also validates the other resources
testGroup.get_did_by_tel_url = function () {
    const telURL = addressFactory.createTelURL('0000000000')
    const result = didsAPI.getDIDByTelUrl(telURL)
    assertTrue(result.status == Status.OK)
    assertTrue(result.obj.kind == 'DID')
}

// This also validates the other resources
testGroup.get_users = function () {
    const result = usersAPI.getUsers("@.spec.credentials.username=='admin'")
    assertTrue(result.status == Status.OK)
    assertTrue(result.obj.length == 1)
}

// This also validates the other resources
testGroup.get_user_by_username = function () {
    const result = usersAPI.getUser('admin')
    assertTrue(result.status == Status.OK)
    assertTrue(result.obj.kind == 'User')
}
