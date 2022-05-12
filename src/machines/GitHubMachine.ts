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
type CommitEvent = { type: 'NEWCOMMIT', commitsCount: number}
type ApproveEvent = { type: 'APPROVEPR'}

type GitHubMachineEvents = 
    | CreateEvent
    | AssignEvent
    | OpenPrEvent
    | ReqChangeEvent
    | CommitEvent
    | ApproveEvent

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

const newCommit = assign<GitHubMachineContext, CommitEvent>({
    commitsCount: (context) => context.commitsCount + 1
})

const requestedChanges = assign<GitHubMachineContext, ReqChangeEvent>({
    changeRequested: (context, event) => event.changeRequested
})

const aprrovePR = assign<GitHubMachineContext, ApproveEvent>({
    merged: (context) => true
})


export const GithubMachine = createMachine<GitHubMachineContext, GitHubMachineEvents, GitHubMachineState>({
    initial: "idle",
    context: {
        issueName: '',
        devName:'',
        prTitle:'',
        commitsCount: 0,
        changeRequested:'',
        merged: false
    } as GitHubMachineContext,

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
                    actions: [aprrovePR]
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
        closed:{}
    },
    actions: {
        createIssue,
        assignedDev,
        openPr,
        newCommit,
        requestedChanges
    }
})