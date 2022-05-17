import { assign, createMachine } from "xstate";


type GitHubMachineContext = {
    issueName: string;
    devName:string;
    prTitle:string;
    commitsCount: number;
    changeRequested:string;
    merged: boolean;
}

type CreateEvent = { type: 'CREATEISSUE', issueName: string }
type AssignEvent = { type: 'ASSIGNDEV', devName: string}
type OpenPrEvent = { type: 'OPENPR', prTitle: string  }
type ReqChangeEvent = { type: 'REQUESTCHANGE', changeRequested: string}
type CommitEvent = { type: 'NEWCOMMIT'}
type ApproveEvent = { type: 'APPROVEPR'}
type ResetEvent= { type: 'RESET'}

type GitHubMachineEvents =
    | CreateEvent
    | AssignEvent
    | OpenPrEvent
    | ReqChangeEvent
    | CommitEvent
    | ApproveEvent
    | ResetEvent

type GitHubMachineState =
    | { value: 'idle', context: GitHubMachineContext}
    | { value: 'issueCreated', context: GitHubMachineContext}
    | { value: 'assigned', context: GitHubMachineContext}
    | { value: 'inReview', context: GitHubMachineContext}
    | { value: 'inRevision', context: GitHubMachineContext}
    | { value: 'inReview', context: GitHubMachineContext}
    | { value: 'closed', context: GitHubMachineContext}


const createIssue = assign<GitHubMachineContext, CreateEvent>({
    issueName: (context, event) => event.issueName
});

const assignedDev = assign<GitHubMachineContext, AssignEvent>({
    devName: (context, event) => event.devName
})

const openPr = assign<GitHubMachineContext, OpenPrEvent>({
    prTitle: (context, event) => event.prTitle
})

const newCommit = assign<GitHubMachineContext, any>({
    commitsCount: (context) => context.commitsCount + 1
})

const requestedChanges = assign<GitHubMachineContext, ReqChangeEvent>({
    changeRequested: (context, event) => event.changeRequested
})

const approvePR = assign<GitHubMachineContext, ApproveEvent>({
    merged: () => true
})

const reset = assign<GitHubMachineContext, ResetEvent>({
    issueName: () => '',
    devName: () => '',
    prTitle: () => '',
    commitsCount: () => 0,
    changeRequested: () => '',
    merged: () => false
})


const initialContext: GitHubMachineContext = {issueName: '',
devName:'',
prTitle:'',
commitsCount: 0,
changeRequested:'',
merged: false}

export const GithubMachine = createMachine<GitHubMachineContext, GitHubMachineEvents, GitHubMachineState>({
    initial: "idle",
    context: initialContext,
    states: {
        idle: {
            on: {
                CREATEISSUE: {
                    target: "issueCreated",
                    actions: [createIssue]
                },
            },
        },
        issueCreated: {
            on: {
                ASSIGNDEV: {
                    target: "assigned",
                    actions: [assignedDev]
                }
            }
        },
        assigned: {
            on:{
                OPENPR: {
                    target:"inReview",
                    actions: [openPr, newCommit],
                }
            }
        },
        inReview:{
            on:{
                REQUESTCHANGE: {
                    target: "inRevision",
                    actions: [requestedChanges]
                },
                APPROVEPR: {
                    target: 'closed',
                    actions: [approvePR]
                }
            }
        },
        inRevision: {
            on: {
                NEWCOMMIT: {
                    target: "inReview",
                    actions: [newCommit],
                }
            }
        },
        closed:{
            on: {
                RESET: {
                    target: "idle",
                    actions: [reset]
                }
            }
        }
    },
})