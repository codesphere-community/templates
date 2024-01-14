-- SQLite
INSERT INTO roadmap (id, title, description, status, month, upvotes, fires, hearts)
VALUES 
    (1,'Uptime monitoring','See the uptime of your connected domains in the workspace table and react to outages faster. Later we will add integrated alerting.','planned','July',0,1,0),
    (2,'Dev Deployment Mode (Workspaces sleep when unused)','Workspaces in dev deployment mode turn off when not used. Visiting the domain will boot it up again within seconds. This way you can run many preview environments and spend less on compute.','planned','August',2,3,2),
    (3,'Package Manager (Sudo-apt get)','Install OS level packages into your workspace. With this a lot of additional use cases can be implemented in Codesphere.','planned','August',1,0,3),
    (4,'Replicas per workspace','Flexibly scale your production workspaces up or down with a few clicks to maintain sufficient compute for any level of traffic. Later also via autoscaling.','planned','October',0,1,0),
    (5,'Copy Workspace','Enable users to copy workspaces from the UI. Create staging environments faster or test smaller changes directly without git.','released','May',0,0,0),
    (6,'Free plan for workspaces','Run smaller projects free forever in workspaces that turn off when unused.','released','June',0,1,0),
    (7,'Marketplace: Managed PostgreSQL','Create PostgreSQL for your cloud needs without leaving the Codesphere UI. Centralized service management & billing','released','May',0,0,0),
    (8,'Create workspaces from public GitHub URLs','Instantly create workspaces directly from public GitHub URLs. Simply append the repository URL like this: https://codesphere.com/https://github.com/codesphere-cloud/large-language-example-app','released','June',0,0,0);