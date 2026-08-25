const fs = require('fs');
const path = require('path');

const rawData = `1	08/01/2026	8356933056	Honey Talreja	11,000	No	Annual Max	1	Organic
2	08/01/2026	9168730336	Chhaya Patel	11,000	No	Annual Max	1	Organic
3	08/01/2026	9799924024	Preyashi Roy	11,000	No	Annual Max	1	Organic
4	08/01/2026	7977812081	Amol Landge	11,000	No	Annual Max	1	Events
5	08/01/2026	9488751655	Amol Landge	11,000	No	Annual Max	1	Events
6	08/01/2026	9066456184	Vikas Poonia	11,000	No	Annual Max	1	Events
7	08/01/2026	9164522538	Amol Landge	11,000	No	Annual Max	1	Events
8	08/01/2026	8050861793	Vikas Poonia	11,000	No	Annual Max	1	Events
9	08/01/2026	9850643389	Vikas Poonia	10,376	No	Annual Max	1	Renewals
10	08/01/2026	7674012484	Amol Landge	11,000	No	Annual Max	1	Events
11	08/01/2026	7676891432	Vikas Poonia	11,000	No	Annual Max	1	Events
12	08/01/2026	7207850796	Prerak Bhavsar	5,032	No	Annual Mini	1	Organic
13	08/01/2026	9826060097	Honey Talreja	12,216	No	Annual Max	1	Events
14	08/01/2026	7775963204	Honey Talreja	5,755	No	Quarterly Max	1	Organic
15	08/01/2026	8377966508	Amol Landge	11,000	No	Annual Max	1	Events
16	08/01/2026	8050016643	Vikas Poonia	11,000	No	Annual Max	1	Events
17	08/01/2026	9006620340	Sneha Anand	12,216	No	Annual Max	1	Organic
18	08/01/2026	7798968886	Amol Landge	11,000	No	Annual Max	1	Events
19	08/01/2026	8431184621	Vikas Poonia	11,000	No	Annual Max	1	Events
20	08/01/2026	9717865035	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
21	08/01/2026	9971347111	Vikas Poonia	10,376	No	Annual Max	1	Events
22	08/01/2026	9817161612	Sneha Anand	1,500	No	Quarterly Max	1	Upgrade
23	08/01/2026	9304442306	Vikas Poonia	11,000	No	Annual Max	1	Events
24	08/01/2026	9425032099	Shivani Gupta	10,000	No	Annual Max	1	Events
25	08/01/2026	7760025000	Amol Landge	11,000	No	Annual Max	1	Events
26	08/01/2026	9741777448	Amol Landge	10,376	No	Annual Max	1	Events
27	08/01/2026	9677140286	Amol Landge	11,000	No	Annual Max	1	Events
28	08/01/2026	7302703987	Preyashi Roy	4,500	No	Quarterly Max	1	Organic
29	08/01/2026	9986998799	Amol Landge	11,000	No	Annual Max	1	Events
30	08/01/2026	8959349497	Shivani Gupta	11,000	No	Annual Max	1	Events
31	08/01/2026	8975118657	Shubham Rai	12,000	No	Annual Max	1	Organic
32	08/01/2026	9873075975	Vivek Shah	14,500	No	Annual Max	1	Organic
33	08/01/2026	7698574633	Kush Shah	11,000	No	Annual Max	1	Organic
34	08/02/2026	9969289568	Honey Talreja	11,000	No	Annual Max	1	Organic
35	08/02/2026	9908324888	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
36	08/02/2026	7620925858	Preyashi Roy	11,000	No	Annual Max	1	Organic
37	08/02/2026	7013979484	Sneha Anand	4,500	No	Quarterly Max	1	Organic
38	08/02/2026	7045023104	Vikas Poonia	10,376	No	Annual Max	1	Renewals
39	08/02/2026	7987239064	Amol Landge	4,500	No	Quarterly Max	1	Renewals
40	08/02/2026	9700547397	Sneha Anand	4,500	No	Quarterly Max	1	Organic
41	08/02/2026	8652246531	Sneha Anand	11,000	No	Annual Max	1	Organic
42	08/02/2026	8147770001	Vikas Poonia	11,000	No	Annual Max	1	Events
43	08/02/2026	8693833686	Vivek Shah	5,000	No	Quarterly Max	1	Organic
44	08/02/2026	9739111732	Amol Landge	11,000	No	Annual Max	1	Events
45	08/02/2026	7044305567	Vikas Poonia	10,376	No	Annual Max	1	Events
46	08/02/2026	8076419145	Kush Shah	4,500	No	Quarterly Max	1	Organic
47	08/02/2026	7022921725	Amol Landge	4,000	No	Quarterly Max	1	Events
48	08/02/2026	626011468	Kausturi Roy Chowdhury	5,756	No	Quarterly Max	1	Organic
49	08/02/2026	9968170747	Kush Shah	11,000	No	Annual Max	1	Organic
50	08/02/2026	9891147282	Shivani Gupta	11,000	No	Annual Max	1	Organic
51	08/02/2026	9871616572	Shubham Rai	17,000	No	Annual Max	1	Organic
52	08/02/2026	9124928747	Shikha Singh	11,000	No	Annual Max	1	Organic
53	08/02/2026	9952099259	Honey Talreja	5,500	No	Annual Mini	1	Organic
54	08/03/2026	7795950373	Honey Talreja	11,000	No	Annual Max	1	Organic
55	08/03/2026	9723779014	Shivani Gupta	11,000	No	Annual Max	1	Organic
56	08/03/2026	9904129899	Honey Talreja	12,000	No	Annual Max	1	Organic
57	08/03/2026	8368554784	Honey Talreja	7,000	No	6 months Max	1	Organic
58	08/03/2026	6388920133	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
59	08/03/2026	9535960056	Vikas Poonia	10,376	No	Annual Max	1	Renewals
60	08/03/2026	7224822132	Chhaya Patel	3,160	No	Quarterly Plus	1	Organic
61	08/03/2026	9650608717	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
62	08/03/2026	7768055353	Vivek Shah	12,216	No	Annual Max	1	Organic
63	08/03/2026	7435821567	Kush Shah	11,000	No	Annual Max	1	Organic
64	08/03/2026	9689842928	Jivesh Harde	12,000	No	Annual Max	1	Organic
65	08/03/2026	9819404727	Honey Talreja	4,500	No	Quarterly Max	1	Organic
66	08/03/2026	9929091810	Kush Shah	10,500	No	Annual Max	1	Organic
67	08/03/2026	9717399769	Prerak Bhavsar	8,500	No	Annual Plus	1	Organic
68	08/03/2026	9021256471	Chhaya Patel	5,736	No	Quarterly Max	1	Organic
69	08/03/2026	9819809944	Honey Talreja	4,500	No	Quarterly Max	1	Organic
70	08/03/2026	9004008347	Sneha Anand	12,216	No	Annual Max	1	Organic
71	08/03/2026	8360199067	Chhaya Patel	11,000	No	Annual Max	1	Organic
72	08/03/2026	9574311093	Chhaya Patel	17,073	No	Annual Max	1	Organic
73	08/03/2026	9724441744	Sneha Anand	4,500	No	Quarterly Max	1	Organic
74	08/03/2026	8971670271	Shikha Singh	15,000	No	Annual Max	1	Organic
75	08/03/2026	9971117047	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
76	08/03/2026	9573338913	Honey Talreja	5,756	No	Quarterly Max	1	Organic
77	08/03/2026	9601467689	Shivani Gupta	8,500	No	Annual Plus	1	Organic
78	08/04/2026	9911133384	Preyashi Roy	11,000	No	Annual Max	1	Organic
79	08/04/2026	7869956800	Prerak Bhavsar	4,500	No	Quarterly Max	1	Organic
80	08/04/2026	9999533422	Honey Talreja	15,000	No	Annual Max	1	Organic
81	08/04/2026	8586979708	Shubham Rai	8,000	No	Annual Plus	1	Organic
82	08/04/2026	8861483108	Vikas Poonia	10,376	No	Annual Max	1	Renewals
83	08/04/2026	9060024102	Kush Shah	11,000	No	Annual Max	1	Organic
84	08/04/2026	7060321024	Sneha Anand	7,000	No	6 months Max	1	Organic
85	08/04/2026	8073960575	Shubham Rai	11,000	No	Annual Max	1	Organic
86	08/04/2026	7042389978	Honey Talreja	4,577	No	Quarterly Max	1	Organic
87	08/04/2026	7021801877	Shivani Gupta	5,000	No	Quarterly Max	1	Organic
88	08/04/2026	9582099679	Shivani Gupta	14,000	No	Annual Max	1	Organic
89	08/04/2026	9920707147	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
90	08/04/2026	9819680510	Shikha Singh	11,000	No	Annual Max	1	Organic
91	08/04/2026	9909854176	Kush Shah	12,000	No	Annual Max	1	Organic
92	08/04/2026	7738190194	Vivek Shah	11,000	No	Annual Max	1	Organic
93	08/04/2026	9662095284	Amol Landge	11,000	No	Annual Max	1	Events
94	08/04/2026	8482855532	Sneha Anand	12,000	No	Annual Max	1	Organic
95	08/04/2026	9560068904	Sneha Anand	7,000	No	6 months Max	1	Organic
96	08/04/2026	9016415364	Shivani Gupta	11,000	No	Annual Max	1	Organic
97	08/04/2026	6354530755	Amol Landge	11,000	No	Annual Max	1	Organic
98	08/04/2026	9319412062	Jivesh Harde	11,000	No	Annual Max	1	Organic
99	08/04/2026	9768214919	Chhaya Patel	12,000	No	Annual Max	1	Organic
100	08/04/2026	9981807811	Chhaya Patel	2,807	No	Quarterly Plus	1	Organic
101	08/04/2026	8147995946	Abhijeet Mathur	12,000	No	Annual Max	1	Organic
102	08/04/2026	8983142467	Sneha Anand	5,500	No	Annual Mini	1	Organic
103	08/04/2026	7019912263	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
104	08/05/2026	9013560444	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
105	08/05/2026	8010455699	Kush Shah	4,500	No	Quarterly Max	1	Organic
106	08/05/2026	9314453100	Others	11,000	No	Annual Max	1	Organic
107	08/05/2026	8769097447	Jivesh Harde	11,000	No	Annual Max	1	Organic
108	08/05/2026	9537447666	Chhaya Patel	10,500	No	Annual Max	1	Renewals
109	08/05/2026	8178350906	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
110	08/05/2026	8008369616	Kush Shah	4,500	No	Quarterly Max	1	Organic
111	08/05/2026	9817932533	Honey Talreja	6,500	No	Annual Max	1	Upgrade
112	08/05/2026	8884794441	Prerak Bhavsar	5,000	No	Quarterly Max	1	Organic
113	08/05/2026	8860516539	Honey Talreja	12,000	No	Annual Max	1	Organic
114	08/05/2026	9839315408	Prerak Bhavsar	12,216	No	Annual Max	1	Organic
115	08/05/2026	9651808080	Jivesh Harde	11,000	No	Annual Max	1	Organic
116	08/05/2026	7838100118	Prerak Bhavsar	4,500	No	Quarterly Max	1	Organic
117	08/05/2026	9826300500	Shubham Rai	2,751	No	Quarterly Max	1	Upgrade
118	08/05/2026	8305919883	Honey Talreja	12,000	No	Annual Max	1	Organic
119	08/05/2026	7096067240	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
120	08/06/2026	7249512675	Vikas Poonia	10,000	No	Annual Max	1	Renewals
121	08/06/2026	7023577220	Honey Talreja	12,000	No	Annual Max	1	Organic
122	08/06/2026	9601923550	Honey Talreja	11,000	No	Annual Max	1	Organic
123	08/06/2026	9848547743	Preyashi Roy	5,000	No	Quarterly Max	1	Organic
124	08/06/2026	9559449682	Kush Shah	12,000	No	Annual Max	1	Organic
125	08/06/2026	9552589119	Vikas Poonia	4,000	No	Quarterly Max	1	Organic
126	08/05/2026	8238236823	Sneha Anand	4,577	No	Quarterly Max	1	Organic
127	08/06/2026	9998059884	Amol Landge	2,000	No	Annual Max	1	Upgrade
128	08/06/2026	8082788465	Honey Talreja	12,000	No	Annual Max	1	Organic
129	08/06/2026	8160228089	Sneha Anand	10,500	No	Annual Max	1	Organic
130	08/06/2026	9879735197	Sneha Anand	10,500	No	Annual Max	1	Organic
131	08/06/2026	9730134501	Shubham Rai	8,000	No	Annual Plus	1	Organic
132	08/06/2026	8238620887	Kush Shah	2,800	No	Quarterly Max	1	Upgrade
133	08/06/2026	9636656580	Kausturi Roy Chowdhury	10,000	No	Annual Max	1	Renewals
134	08/06/2026	9664955156	Prerak Bhavsar	10,000	No	Annual Max	1	Renewals
135	08/06/2026	7898881039	Vivek Shah	13,000	No	Annual Max	1	Organic
136	08/06/2026	9821691091	Sneha Anand	10,000	No	Annual Max	1	Renewals
137	08/07/2026	9949395243	Kush Shah	12,000	No	Annual Max	1	Organic
138	08/07/2026	9699737069	Vivek Shah	11,000	No	Annual Max	1	Organic
139	08/07/2026	9742737018	Shivani Gupta	14,000	No	Annual Max	1	Organic
140	08/07/2026	8197576324	Vikas Poonia	7,000	No	Annual Plus	1	Renewals
141	08/07/2026	9899242169	Kausturi Roy Chowdhury	12,000	No	Annual Max	1	Organic
142	08/07/2026	9619159001	Honey Talreja	5,000	No	Quarterly Max	1	Organic
143	08/07/2026	8291112613	Jivesh Harde	11,000	No	Annual Max	1	Organic
144	08/07/2026	9408474954	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
145	08/07/2026	9894634317	Kush Shah	4,500	No	Quarterly Max	1	Organic
146	08/07/2026	9893640123	Honey Talreja	7,000	No	Annual Max	1	Events
147	08/07/2026	9035301305	Kush Shah	11,000	No	Annual Max	1	Organic
148	08/07/2026	8275680761	Honey Talreja	11,000	No	Annual Max	1	Organic
149	08/08/2026	9686661193	Vivek Shah	8,923	No	Annual Max	1	Upgrade
150	08/08/2026	9664749378	Honey Talreja	11,000	No	Annual Max	1	Organic
151	08/08/2026	9923582768	Honey Talreja	5,000	No	Annual Max	1	Organic
152	08/08/2026	9825912192	Amol Landge	10,376	No	Annual Max	1	Renewals
153	08/08/2026	7588580717	Jivesh Harde	11,000	No	Annual Max	1	Organic
154	08/08/2026	8160666164	Amol Landge	11,000	No	Annual Max	1	Organic
155	08/08/2026	9999113461	Vikas Poonia	11,000	No	Annual Max	1	Events
156	08/08/2026	8376029046	Vikas Poonia	11,000	No	Annual Max	1	Events
157	08/08/2026	8886578656	Kush Shah	12,000	No	Annual Max	1	Organic
158	08/08/2026	8860634929	Others	7,000	No	6 months Max	1	Organic
159	08/08/2026	8097894685	Shivani Gupta	4,000	No	Quarterly Max	1	Renewals
160	08/08/2026	9811432284	Honey Talreja	4,500	No	Quarterly Max	1	Organic
161	08/08/2026	9987402909	Vikas Poonia	10,376	No	Annual Max	1	Organic
162	08/08/2026	9036224651	Vivek Shah	12,216	No	Annual Max	1	Organic
163	08/08/2026	9891011516	Amol Landge	10,376	No	Annual Max	1	Renewals
164	08/08/2026	8860449084	Sneha Anand	11,000	No	Annual Max	1	Organic
165	08/08/2026	7019496980	Kush Shah	4,500	No	Quarterly Max	1	Organic
166	08/08/2026	9820303469	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
167	08/08/2026	9540088994	Honey Talreja	11,000	No	Annual Max	1	Organic
168	08/09/2026	8871999390	Amol Landge	10,376	No	Annual Max	1	Organic
169	08/09/2026	8147004442	Honey Talreja	5,000	No	Quarterly Max	1	Organic
170	08/09/2026	9666880480	Honey Talreja	12,000	No	Annual Max	1	Organic
171	08/09/2026	8955731245	Vikas Poonia	11,000	No	Annual Max	1	Events
172	08/09/2026	8927068351	Rohit Jain	11,000	No	Annual Max	1	Organic
173	08/09/2026	9408771022	Vikas Poonia	11,000	No	Annual Max	1	Events
174	08/09/2026	9766455136	Honey Talreja	7,200	No	Annual Max	1	Upgrade
175	08/09/2026	9479379275	Shubham Rai	11,000	No	Annual Max	1	Organic
176	08/09/2026	9440788035	Amol Landge	10,376	No	Annual Max	1	Renewals
177	08/09/2026	9923757352	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
178	08/09/2026	7715089296	Kush Shah	4,500	No	Quarterly Max	1	Organic
179	08/09/2026	9920242132	Shivani Gupta	14,000	No	Annual Max	1	Organic
180	08/09/2026	7838285889	Preyashi Roy	11,000	No	Annual Max	1	Organic
181	08/09/2026	9824089750	Sneha Anand	11,000	No	Annual Max	1	Organic
182	08/09/2026	9426327027	Kausturi Roy Chowdhury	12,216	No	Annual Max	1	Organic
183	08/09/2026	7386634940	Vikas Poonia	11,000	No	Annual Max	1	Organic
184	08/09/2026	9925653372	Vikas Poonia	4,000	No	Quarterly Max	1	Events
185	08/09/2026	8619769602	Kush Shah	11,000	No	Annual Max	1	Organic
186	08/09/2026	9099056070	Sneha Anand	11,000	No	Annual Max	1	Organic
187	08/09/2026	8197307575	Amol Landge	10,376	No	Annual Max	1	Renewals
188	08/09/2026	9725472426	Vikas Poonia	10,376	No	Annual Max	1	Events
189	08/09/2026	9248179252	Shivani Gupta	5,000	No	Quarterly Max	1	Organic
190	08/09/2026	9426522898	Others	3,160	No	Quarterly Plus	1	Organic
191	08/09/2026	9967634086	Amol Landge	10,000	No	Annual Max	1	Renewals
192	08/09/2026	9867463240	Shashank Tiwari	3,000	No	Quarterly Plus	1	Organic
193	08/09/2026	8108248248	Honey Talreja	11,000	No	Annual Max	1	Organic
194	08/09/2026	7894137611	Prerak Bhavsar	11,000	No	Annual Max	1	Events
195	08/09/2026	9782881244	Kausturi Roy Chowdhury	12,215	No	Annual Max	1	Organic
196	08/10/2026	9925236012	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
197	08/10/2026	7383966506	Honey Talreja	17,073	No	Annual Max	1	Organic
198	08/10/2026	8780770172	Prerak Bhavsar	5,000	No	Quarterly Max	1	Events
199	08/10/2026	8291296465	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
200	08/10/2026	8850020563	Kausturi Roy Chowdhury	12,216	No	Annual Max	1	Organic
201	08/10/2026	9979554154	Shubham Rai	11,000	No	Annual Max	1	Organic
202	08/10/2026	8454848418	Jivesh Harde	11,000	No	Annual Max	1	Organic
203	08/10/2026	9975680127	Amol Landge	11,000	No	Annual Max	1	Events
204	08/10/2026	9958109397	Kausturi Roy Chowdhury	3,160	No	Quarterly Plus	1	Organic
205	08/10/2026	7016200981	Tanveer Ahmed	14,000	No	Annual Max	1	Organic
206	08/11/2026	9028923444	Preyashi Roy	11,000	No	Annual Max	1	Organic
207	08/11/2026	9527319074	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
208	08/11/2026	8376098789	Amol Landge	4,000	No	Quarterly Max	1	Renewals
209	08/11/2026	8097132061	Vivek Shah	12,100	No	Annual Max	1	Organic
210	08/11/2026	8460042363	Jivesh Harde	11,000	No	Annual Max	1	Organic
211	08/11/2026	9604272813	Honey Talreja	2,800	No	Quarterly Plus	1	Organic
212	08/11/2026	8860700935	Chhaya Patel	5,425	No	Quarterly Max	1	Organic
213	08/11/2026	9167626390	Sneha Anand	4,500	No	Quarterly Max	1	Organic
214	08/11/2026	9987722286	Shashank Tiwari	12,000	No	Annual Max	1	Organic
215	08/11/2026	9873771774	Shashank Tiwari	4,000	No	Quarterly Max	1	Organic
216	08/11/2026	7204963907	Shubham Rai	6,600	Yes	Annual Max	0.5	Organic
217	08/11/2026	7204963907	Honey Talreja	4,400	Yes	Annual Max	0.5	Organic
218	08/11/2026	8320839155	Kush Shah	4,500	No	Quarterly Max	1	Organic
219	08/11/2026	9867510047	Jivesh Harde	11,000	No	Annual Max	1	Organic
220	08/11/2026	9873064059	Chhaya Patel	5,756	No	Quarterly Max	1	Organic
221	08/11/2026	8790579308	Prerak Bhavsar	5,000	No	Quarterly Max	1	Organic
222	08/11/2026	9372216751	Shivani Gupta	4,000	No	Quarterly Max	1	Organic
223	08/11/2026	9557062962	Vivek Shah	4,500	No	Quarterly Max	1	Organic
224	08/11/2026	7987213659	Shubham Rai	11,000	No	Annual Max	1	Organic
225	08/12/2026	9907575797	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
226	08/12/2026	9717438259	Amol Landge	10,376	No	Annual Max	1	Renewals
227	08/12/2026	9940117071	Tanveer Ahmed	15,000	No	Annual Max	1	Organic
228	08/12/2026	8160582238	Shubham Rai	12,216	No	Annual Max	1	Organic
229	08/12/2026	8879481174	Amol Landge	4,000	No	Quarterly Max	1	Renewals
230	08/12/2026	8735029467	Shubham Rai	11,000	No	Annual Max	1	Organic
231	08/12/2026	7304737194	Sneha Anand	11,000	No	Annual Max	1	Organic
232	12/08/2026	9999209975	Shivani Gupta	12,216	No	Annual Max	1	Organic
233	12/08/2026	8460497360	Amol Landge	10,376	No	Annual Max	1	Renewals
234	12/08/2026	9928542735	Honey Talreja	4,000	No	Quarterly Max	1	Organic
235	12/08/2026	7718057058	Sneha Anand	5,500	No	Annual Mini	1	Organic
236	12/08/2026	9035346974	Amol Landge	10,376	No	Annual Max	1	Renewals
237	12/08/2026	7799521021	Kush Shah	11,000	No	Annual Max	1	Organic
238	12/08/2026	9930535410	Jivesh Harde	11,000	No	Annual Max	1	Organic
239	12/08/2026	9818962169	Naveen Suwalka	4,500	No	Quarterly Max	1	Organic
240	12/08/2026	8285813984	Tanveer Ahmed	5,756	No	Quarterly Max	1	Organic
241	13/08/2026	9899252233	Honey Talreja	12,000	No	Annual Max	1	Organic
242	13/08/2026	9591921100	Jivesh Harde	12,000	No	Annual Max	1	Organic
243	13/08/2026	6357149837	Honey Talreja	12,000	No	Annual Max	1	Organic
244	13/08/2026	6357149837	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
245	13/08/2026	9974541947	Chhaya Patel	12,000	No	Annual Max	1	Organic
246	13/08/2026	8007780307	Kausturi Roy Chowdhury	12,000	No	Annual Max	1	Organic
247	13/08/2026	9930227092	Amol Landge	12,000	No	Annual Max	1	Organic
248	13/08/2026	9339627002	Preyashi Roy	12,000	No	Annual Max	1	Organic
249	13/08/2026	9950624558	Vikas Poonia	12,000	No	Annual Max	1	Organic
250	13/08/2026	8160431610	Kush Shah	12,000	No	Annual Max	1	Organic
251	13/08/2026	7990870031	Shivani Gupta	12,000	No	Annual Max	1	Organic
252	13/08/2026	9849640558	Kush Shah	12,000	No	Annual Max	1	Organic
253	13/08/2026	9899280257	Rohit Jain	12,000	No	Annual Max	1	Organic
254	13/08/2026	9009752111	Vikas Poonia	12,000	No	Annual Max	1	Organic
255	13/08/2026	9004735097	Vikas Poonia	12,000	No	Annual Max	1	Organic
256	13/08/2026	8010143864	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
257	13/08/2026	9650025274	Honey Talreja	12,000	No	Annual Max	1	Organic
258	13/08/2026	9904035352	Kush Shah	12,000	No	Annual Max	1	Organic
259	13/08/2026	9461118720	Shivani Gupta	12,000	No	Annual Max	1	Organic
260	13/08/2026	9644472224	Honey Talreja	12,000	No	Annual Max	1	Organic
261	13/08/2026	9555690401	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
262	13/08/2026	9819404243	Shivani Gupta	12,000	No	Annual Max	1	Organic
263	14/08/2026	8160353549	Preyashi Roy	12,000	No	Annual Max	1	Organic
264	14/08/2026	9879675434	Vikas Poonia	10,376	No	Annual Max	1	Renewals
265	14/08/2026	9898088625	Amol Landge	11,000	No	Annual Max	1	Organic
266	14/08/2026	9769602604	Vikas Poonia	10,376	No	Annual Max	1	Renewals
267	14/08/2026	9662300575	Honey Talreja	11,000	No	Annual Max	1	Organic
268	14/08/2026	7878062454	Honey Talreja	4,500	No	Quarterly Max	1	Organic
269	14/08/2026	7588588438	Vikas Poonia	10,376	No	Annual Max	1	Renewals
270	14/08/2026	7667669647	Vikas Poonia	11,000	No	Annual Max	1	Renewals
271	14/08/2026	9920269295	Sneha Anand	4,500	No	Quarterly Max	1	Organic
272	14/08/2026	7389027284	Vivek Shah	12,216	No	Annual Max	1	Organic
273	14/08/2026	9028026606	Prerak Bhavsar	10,000	No	Annual Max	1	Renewals
274	14/08/2026	9930818611	Vikas Poonia	7,000	No	Annual Plus	1	Renewals
275	14/08/2026	9726881215	Rani Singh	12,000	No	Annual Max	1	Organic
276	14/08/2026	8058064707	Chhaya Patel	11,000	No	Annual Max	1	Organic
277	14/08/2026	7841824930	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
278	14/08/2026	9963422253	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
279	14/08/2026	9834751620	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
280	14/08/2026	8802801739	Honey Talreja	11,000	No	Annual Max	1	Organic
281	14/08/2026	9916032486	Honey Talreja	12,000	No	Annual Max	1	Organic
282	14/08/2026	9313118557	Vikas Poonia	10,376	No	Annual Max	1	Renewals
283	14/08/2026	9391026674	Chhaya Patel	11,000	No	Annual Max	1	Organic
284	13/08/2026	9527833985	Honey Talreja	17,073	No	Annual Max	1	Organic
285	15/08/2026	9491667195	Vikas Poonia	10,376	No	Annual Max	1	Renewals
286	15/08/2026	9959046626	Vikas Poonia	10,376	No	Annual Max	1	Renewals
287	15/08/2026	7045359560	Sneha Anand	4,500	No	Quarterly Max	1	Organic
288	15/08/2026	7678297074	Vikas Poonia	10,376	No	Annual Max	1	Renewals
289	15/08/2026	9033925228	Chhaya Patel	11,000	No	Annual Max	1	Organic
290	15/08/2026	7200505312	Vivek Shah	5,000	No	Quarterly Max	1	Organic
291	15/08/2026	7774062000	Amol Landge	11,000	No	Annual Max	1	Events
292	15/08/2026	8076702449	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
293	15/08/2026	9278685671	Vivek Shah	12,216	No	Annual Max	1	Organic
294	15/08/2026	9820686123	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
295	15/08/2026	9994425270	Prerak Bhavsar	10,376	No	Annual Max	1	Renewals
296	15/08/2026	7021623476	Chhaya Patel	4,500	No	Quarterly Max	1	Organic
297	15/08/2026	9974044878	Honey Talreja	11,000	No	Annual Max	1	Organic
298	15/08/2026	7795291148	Kausturi Roy Chowdhury	12,216	No	Annual Max	1	Organic
299	15/08/2026	9766573085	Amol Landge	11,000	No	Annual Max	1	Events
300	15/08/2026	9902069518	Kush Shah	11,000	No	Annual Max	1	Organic
301	15/08/2026	9616638501	Sneha Anand	3,160	No	Quarterly Plus	1	Organic
302	15/08/2026	7726064284	Sneha Anand	4,500	No	Quarterly Max	1	Organic
303	15/08/2026	7770013029	Shubham Rai	12,000	No	Annual Max	1	Organic
304	15/08/2026	8970858687	Vikas Poonia	10,376	No	Annual Max	1	Renewals
305	15/08/2026	8840956994	Jivesh Harde	11,000	No	Annual Max	1	Organic
306	15/08/2026	9145330605	Amol Landge	11,000	No	Annual Max	1	Events
307	15/08/2026	8469023717	Kush Shah	4,500	No	Quarterly Max	1	Organic
308	15/08/2026	8655694358	Honey Talreja	11,000	No	Annual Max	1	Organic
309	15/08/2026	9320555538	Honey Talreja	11,000	No	Annual Max	1	Organic
310	15/08/2026	9049065234	Amol Landge	11,000	No	Annual Max	1	Events
311	15/08/2026	9041301671	Vikas Poonia	7,000	No	Annual Plus	1	Renewals
312	15/08/2026	9035718078	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
313	15/08/2026	9010526518	Rani Singh	12,000	No	Annual Max	1	Organic
314	15/08/2026	9561187696	Naveen Suwalka	11,000	No	Annual Max	1	Organic
315	15/08/2026	9760154794	Vivek Shah	5,756	No	Quarterly Max	1	Organic
316	15/08/2026	7202018036	Amol Landge	17,073	No	Annual Max	1	Organic
317	15/08/2026	8160327504	Honey Talreja	4,000	No	Quarterly Max	1	Renewals
318	15/08/2026	9873180567	Vivek Shah	12,216	No	Annual Max	1	Organic
319	15/08/2026	9685669453	Rohit Jain	4,500	No	Quarterly Max	1	Organic
320	15/08/2026	9000577710	Amol Landge	7,000	No	Annual Plus	1	Renewals
321	15/08/2026	8511841114	Kush Shah	4,500	No	Quarterly Max	1	Organic
322	15/08/2026	9826335326	Vivek Shah	12,216	No	Annual Max	1	Organic
323	15/08/2026	9978220395	Prerak Bhavsar	11,000	No	Annual Max	1	Organic
324	15/08/2026	9818149898	Honey Talreja	11,000	No	Annual Max	1	Organic
325	16/08/2026	8851752764	Sneha Anand	11,000	No	Annual Max	1	Organic
326	16/08/2026	9560733393	Amol Landge	10,376	No	Annual Max	1	Renewals
327	16/08/2026	6355953792	Abhijeet Mathur	12,000	No	Annual Max	1	Organic
328	16/08/2026	8237151430	Vivek Shah	12,216	No	Annual Max	1	Organic
329	16/08/2026	6201230726	Vivek Shah	12,216	No	Annual Max	1	Organic
330	16/08/2026	9004028506	Prerak Bhavsar	11,000	No	Annual Max	1	Organic
331	16/08/2026	8735965906	Prerak Bhavsar	5,000	No	Quarterly Max	1	Organic
332	16/08/2026	7204394609	Vikas Poonia	12,000	No	Annual Max	1	Renewals
333	16/08/2026	8624827119	Amol Landge	11,000	No	Annual Max	1	Events
334	16/08/2026	6367537381	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
335	16/08/2026	9820914437	Amol Landge	11,000	No	Annual Max	1	Events
336	16/08/2026	9723073473	Shikha Singh	17,073	No	Annual Max	1	Organic
337	16/08/2026	7743884001	Shubham Rai	11,000	No	Annual Max	1	Events
338	16/08/2026	9898556019	Honey Talreja	11,000	No	Annual Max	1	Organic
339	16/08/2026	9423272805	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
340	16/08/2026	8689064642	Rani Singh	12,000	No	Annual Max	1	Organic
341	16/08/2026	9999684394	Preyashi Roy	12,216	No	Annual Max	1	Organic
342	16/08/2026	8147848743	Sneha Anand	12,216	No	Annual Max	1	Organic
343	16/08/2026	9538902296	Shikha Singh	11,000	No	Annual Max	1	Events
344	16/08/2026	9619300250	Vivek Shah	11,000	No	Annual Max	1	Organic
345	16/08/2026	9766698088	Amol Landge	11,000	No	Annual Max	1	Events
346	16/08/2026	7209555172	Vivek Shah	7,100	No	6 months Max	1	Organic
347	16/08/2026	9871026834	Preyashi Roy	12,216	No	Annual Max	1	Organic
348	16/08/2026	9766163567	Amol Landge	11,000	No	Annual Max	1	Events
349	16/08/2026	9978484183	Honey Talreja	11,000	No	Annual Max	1	Organic
350	16/08/2026	7977411094	Honey Talreja	12,000	No	Annual Max	1	Organic
351	16/08/2026	7218844905	Vivek Shah	3,160	No	Quarterly Plus	1	Organic
352	16/08/2026	7760865865	Kush Shah	11,000	No	Annual Max	1	Organic
353	16/08/2026	8087560028	Amol Landge	11,000	No	Annual Max	1	Events
354	16/08/2026	9899267425	Vivek Shah	12,216	No	Annual Max	1	Organic
355	16/08/2026	8074435173	Kush Shah	11,000	No	Annual Max	1	Organic
356	16/08/2026	9435110843	Tanveer Ahmed	13,000	No	Annual Max	1	Organic
357	16/08/2026	9440407465	Shikha Singh	11,000	No	Annual Max	1	Events
358	16/08/2026	9028150684	Amol Landge	11,000	No	Annual Max	1	Events
359	16/08/2026	9986026356	Jivesh Harde	11,000	No	Annual Max	1	Organic
360	16/08/2026	9940425069	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
361	16/08/2026	9742942095	Shikha Singh	4,500	No	Quarterly Max	1	Organic
362	16/08/2026	9741777448	Naveen Suwalka	4,500	No	Quarterly Max	1	Organic
363	16/08/2026	8800938258	Abhijeet Mathur	11,000	No	Annual Max	1	Organic
364	16/08/2026	9066700611	Chhaya Patel	4,500	No	Quarterly Max	1	Organic
365	17/08/2026	9137566360	Rani Singh	12,000	No	Annual Max	1	Organic
366	17/08/2026	9833011311	Jivesh Harde	5,500	Yes	Annual Max	0.5	Organic
367	17/08/2026	9833011311	Honey Talreja	5,500	Yes	Annual Max	0.5	Organic
368	17/08/2026	9599387590	Kush Shah	4,500	No	Quarterly Max	1	Organic
369	17/08/2026	9408819554	Vivek Shah	11,000	No	Annual Max	1	Organic
370	17/08/2026	9538904114	Jivesh Harde	11,000	No	Annual Max	1	Organic
371	17/08/2026	9008692499	Kausturi Roy Chowdhury	12,216	No	Annual Max	1	Organic
372	17/08/2026	9898204337	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
373	17/08/2026	9964328445	Kush Shah	4,500	No	Quarterly Max	1	Organic
374	17/08/2026	7666123523	Vivek Shah	12,216	No	Annual Max	1	Organic
375	17/08/2026	8667566013	Naveen Suwalka	4,500	No	Quarterly Max	1	Organic
376	17/08/2026	9718291419	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
377	17/08/2026	8383909723	Jivesh Harde	11,000	No	Annual Max	1	Organic
378	17/08/2026	7353026388	Jivesh Harde	12,000	No	Annual Max	1	Organic
379	17/08/2026	7387390771	Amol Landge	11,000	No	Annual Max	1	Organic
380	17/08/2026	9429898108	Vivek Shah	19,573	No	Annual Max	1	Organic
381	17/08/2026	8019137712	Jivesh Harde	5,000	No	Quarterly Max	1	Organic
382	17/08/2026	9822447236	Sneha Anand	11,000	No	Annual Max	1	Organic
383	17/08/2026	7053878858	Shikha Singh	11,000	No	Annual Max	1	Organic
384	17/08/2026	9172259122	Sneha Anand	4,500	No	Quarterly Max	1	Organic
385	17/08/2026	9689574534	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
386	17/08/2026	7000653812	Honey Talreja	2,869	Yes	Quarterly Max	0.5	Organic
387	17/08/2026	7000653812	Shivani Gupta	2,869	Yes	Quarterly Max	0.5	Organic
388	18/08/2026	9987370667	Jivesh Harde	5,500	No	Annual Mini	1	Organic
389	18/08/2026	9082759352	Shikha Singh	12,000	No	Annual Max	1	Organic
390	18/08/2026	7503077182	Abhijeet Mathur	12,000	No	Annual Max	1	Organic
391	18/08/2026	9871414160	Tanveer Ahmed	12,000	No	Annual Max	1	Organic
392	18/08/2026	9021119409	Kush Shah	4,500	No	Quarterly Max	1	Organic
393	18/08/2026	9725888958	Kush Shah	11,000	No	Annual Max	1	Organic
394	18/08/2026	9223301001	Naveen Suwalka	11,000	No	Annual Max	1	Organic
395	18/08/2026	8976781763	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
396	18/08/2026	9999969020	Abhijeet Mathur	10,000	No	Annual Max	1	Organic
397	18/08/2026	8055586440	Jivesh Harde	12,000	No	Annual Max	1	Organic
398	18/08/2026	9703334188	Vivek Shah	14,000	No	Annual Max	1	Organic
399	18/08/2026	8447989249	Shashank Tiwari	11,000	No	Annual Max	1	Organic
400	18/08/2026	6351121188	Honey Talreja	5,756	No	Quarterly Max	1	Organic
401	19/08/2026	9873435700	Kush Shah	11,000	No	Annual Max	1	Organic
402	19/08/2026	9637808511	Amol Landge	10,376	No	Annual Max	1	Renewals
403	19/08/2026	7011895476	Honey Talreja	12,000	No	Annual Max	1	Organic
404	19/08/2026	9826245330	Rohit Jain	11,000	No	Annual Max	1	Organic
405	19/08/2026	9022424099	Honey Talreja	11,000	No	Annual Max	1	Organic
406	19/08/2026	9665025048	Kunal Sharma	4,500	No	Quarterly Max	1	Organic
407	19/08/2026	8625003500	Vivek Shah	11,000	No	Annual Max	1	Organic
408	19/08/2026	9173734041	Kush Shah	11,000	No	Annual Max	1	Organic
409	19/08/2026	8956737326	Jivesh Harde	11,000	No	Annual Max	1	Organic
410	19/08/2026	8745950940	Tanveer Ahmed	15,000	No	Annual Max	1	Organic
411	19/08/2026	9247327431	Shikha Singh	12,000	No	Annual Max	1	Organic
412	19/08/2026	8826618372	Shubham Rai	11,000	No	Annual Max	1	Organic
413	19/08/2026	9959772237	Vikas Poonia	10,376	No	Annual Max	1	Renewals
414	19/08/2026	9982871085	Kunal Sharma	11,000	No	Annual Max	1	Organic
415	19/08/2026	8527990540	Kush Shah	7,000	No	6 months Max	1	Organic
416	19/08/2026	9278552227	Shubham Rai	11,000	No	Annual Max	1	Organic
417	19/08/2026	6364613131	Honey Talreja	11,000	No	Annual Max	1	Organic
418	19/08/2026	9952020400	Kush Shah	11,000	No	Annual Max	1	Organic
419	19/08/2026	8050942205	Honey Talreja	4,500	No	Annual Max	1	Organic
420	19/08/2026	8373934564	Vivek Shah	11,000	No	Annual Max	1	Organic
421	20/08/2026	8141794712	Naveen Suwalka	4,500	No	Annual Max	1	Organic
422	20/08/2026	7259878126	Shikha Singh	11,000	No	Annual Max	1	Organic
423	20/08/2026	9811000584	Amol Landge	10,376	No	Annual Max	1	Renewals
424	20/08/2026	7433876048	Naveen Suwalka	11,000	No	Annual Max	1	Organic
425	20/08/2026	9953512829	Shubham Rai	12,000	No	Annual Max	1	Organic
426	20/08/2026	9820997197	Vikas Poonia	10,376	No	Annual Max	1	Renewals
427	20/08/2026	7696489451	Vikas Poonia	10,376	No	Annual Max	1	Renewals
428	20/08/2026	9818425467	Kunal Sharma	4,500	No	Quarterly Max	1	Organic
429	20/08/2026	8800411564	Honey Talreja	10,000	No	Annual Max	1	Renewals
430	20/08/2026	9911445583	Shubham Rai	13,000	No	Annual Max	1	Organic
431	20/08/2026	8959472120	Preyashi Roy	11,000	No	Annual Max	1	Organic
432	20/08/2026	7276035684	Vivek Shah	5,000	No	Quarterly Max	1	Organic
433	20/08/2026	9421593516	Shashank Tiwari	4,500	No	Quarterly Max	1	Organic
434	20/08/2026	8466837010	Abhijeet Mathur	9,000	No	Annual Plus	1	Organic
435	20/08/2026	8527296747	Vikas Poonia	4,577	No	Quarterly Max	1	Renewals
436	20/08/2026	9900142916	Amol Landge	10,376	No	Annual Max	1	Renewals
437	20/08/2026	8286401274	Amol Landge	10,376	No	Annual Max	1	Renewals
438	20/08/2026	8286760921	Vivek Shah	11,000	No	Annual Max	1	Organic
439	20/08/2026	9909021793	Sneha Anand	11,000	No	Annual Max	1	Organic
440	20/08/2026	9925578074	Shashank Tiwari	11,000	No	Annual Max	1	Organic
441	20/08/2026	9825661339	Preyashi Roy	12,000	No	Annual Max	1	Organic
442	20/08/2026	9595848228	Shubham Rai	11,000	No	Annual Max	1	Organic
443	20/08/2026	9986048373	Amol Landge	7,000	No	Annual Plus	1	Organic
444	20/08/2026	9718043961	Honey Talreja	11,000	No	Annual Max	1	Organic
445	20/08/2026	7696489451	Honey Talreja	5,188	Yes	Annual Max	0.5	Organic
446	20/08/2026	9958725407	Honey Talreja	5,000	No	Quarterly Max	1	Organic
447	21/08/2026	9820625952	Honey Talreja	6,300	No	Annual Mini	1	Organic
448	21/08/2026	9535025023	Tanveer Ahmed	4,500	No	Quarterly Max	1	Organic
449	21/08/2026	8008550900	Sneha Anand	11,000	No	Annual Max	1	Organic
450	21/08/2026	9124928747	Tanveer Ahmed	11,000	No	Annual Max	1	Organic
451	21/08/2026	8586894194	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
452	21/08/2026	8082653400	Vikas Poonia	7,000	No	Annual Plus	1	Renewals
453	21/08/2026	9920856056	Amol Landge	10,376	No	Annual Max	1	Renewals
454	21/08/2026	8209797544	Shikha Singh	11,000	No	Annual Max	1	Organic
455	21/08/2026	9867122369	Vivek Shah	13,500	No	Annual Max	1	Organic
456	21/08/2026	9990970630	Prerak Bhavsar	11,000	No	Annual Max	1	Organic
457	21/08/2026	9510000586	Shashank Tiwari	10,500	No	Annual Max	1	Organic
458	21/08/2026	7248961825	Shubham Rai	12,000	No	Annual Max	1	Organic
459	21/08/2026	8470940129	Honey Talreja	17,073	No	Annual Max	1	Organic
460	21/08/2026	7387737926	Vikas Poonia	10,376	No	Annual Max	1	Organic
461	21/08/2026	7022795083	Shashank Tiwari	5,000	No	Quarterly Max	1	Organic
462	21/08/2026	7990586653	Honey Talreja	11,000	No	Annual Max	1	Organic
463	21/08/2026	9824196418	Honey Talreja	11,000	No	Annual Max	1	Organic
464	21/08/2026	7387678612	Vikas Poonia	10,376	No	Annual Max	1	Organic
465	21/08/2026	8466837010	Abhijeet Mathur	2,000	No	Annual Max	1	Upgrade
466	21/08/2026	8286111110	Honey Talreja	11,000	No	Annual Max	1	Organic
467	21/08/2026	9051435359	Amol Landge	10,675	No	Annual Max	1	Organic
468	21/08/2026	7993397728	Honey Talreja	17,073	No	Annual Max	1	Organic
469	21/08/2026	9059574567	Kausturi Roy Chowdhury	25,500	No	Ultra Annually	1	Organic
470	21/08/2026	9711787118	Naveen Suwalka	11,000	No	Annual Max	1	Organic
471	21/08/2026	8401020374	Tanveer Ahmed	13,000	No	Annual Max	1	Organic
472	21/08/2026	9662266314	Honey Talreja	6,500	Yes	Annual Max	0.5	Organic
473	21/08/2026	8604678511	Kush Shah	4,500	No	Quarterly Max	1	Organic
474	21/08/2026	9727771142	Kausturi Roy Chowdhury	11,000	No	Annual Max	1	Organic
475	21/08/2026	9662266314	Tanveer Ahmed	7,500	Yes	Annual Max	0.5	Organic
476	22/08/2026	9148155741	Vikas Poonia	10,376	No	Annual Max	1	Renewals
477	22/08/2026	9813606264	Rani Singh	12,000	No	Annual Max	1	Organic
478	22/08/2026	9711218157	Kush Shah	11,000	No	Annual Max	1	Organic
479	22/08/2026	9879140909	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
480	22/08/2026	8310307008	Honey Talreja	5,000	No	Quarterly Max	1	Organic
481	22/08/2026	9711787118	Naveen Suwalka	11,000	No	Annual Max	1	Organic
482	22/08/2026	9810743977	Preyashi Roy	12,000	No	Annual Max	1	Organic
483	22/08/2026	9990029425	Sneha Anand	12,000	No	Annual Max	1	Organic
484	22/08/2026	9999940243	Honey Talreja	12,000	No	Annual Max	1	Organic
485	22/08/2026	8655463230	Naveen Suwalka	11,000	No	Annual Max	1	Organic
486	22/08/2026	9167472622	Shikha Singh	11,000	No	Annual Max	1	Organic
487	22/08/2026	8866348860	Prerak Bhavsar	12,000	No	Annual Max	1	Organic
488	22/08/2026	9599186369	Vikas Poonia	10,376	No	Annual Max	1	Renewals
489	22/08/2026	9861566969	Amol Landge	5,000	No	Quarterly Max	1	Organic
490	22/08/2026	8879647699	Shubham Rai	3,000	No	Quarterly Plus	1	Organic
491	22/08/2026	7993397728	Sneha Anand	8,537	Yes	Annual Max	0.5	Organic
492	22/08/2026	9014704591	Jivesh Harde	11,000	No	Annual Max	1	Organic
493	22/08/2026	9979377795	Kush Shah	11,000	No	Annual Max	1	Organic
494	22/08/2026	9758329776	Shikha Singh	11,000	No	Annual Max	1	Events
495	22/08/2026	7990743055	Tashrifa Ruhani Saikia	11,000	No	Annual Max	1	Events
496	22/08/2026	9758329776	Shikha Singh	11,000	No	Annual Max	1	Events
497	22/08/2026	9820320502	Amol Landge	12,000	No	Annual Max	1	Organic
498	22/08/2026	7861036246	Neeru Yadav	11,000	No	Annual Max	1	Organic
499	22/08/2026	9247697297	Honey Talreja	13,573	No	Annual Max	1	Organic
500	22/08/2026	9949143090	Kush Shah	11,000	No	Annual Max	1	Organic
501	23/08/2026	9599803502	Kush Shah	11,000	No	Annual Max	1	Organic
502	23/08/2026	9790722725	Amol Landge	11,000	No	Annual Max	1	Events
503	23/08/2026	9960511785	Honey Talreja	4,500	No	Quarterly Max	1	Organic
504	23/08/2026	9763966056	Vivek Shah	12,216	No	Annual Max	1	Organic
505	23/08/2026	9565575359	Sneha Anand	5,756	No	Quarterly Max	1	Organic
506	23/08/2026	9985139375	Amol Landge	11,000	No	Annual Max	1	Events
507	23/08/2026	9930200559	Honey Talreja	11,000	No	Annual Max	1	Organic
508	23/08/2026	9773315283	Vikas Poonia	10,376	No	Annual Max	1	Renewals
509	23/08/2026	6304647301	Amol Landge	10,376	No	Annual Max	1	Events
510	23/08/2026	9040361217	Chhaya Patel	11,000	No	Annual Max	1	Organic
511	23/08/2026	9966193243	Amol Landge	11,000	No	Annual Max	1	Events
512	23/08/2026	9989445140	Amol Landge	11,000	No	Annual Max	1	Events
513	23/08/2026	8297248700	Amol Landge	11,000	No	Annual Max	1	Events
514	23/08/2026	7507722389	Kunal Sharma	4,500	No	Quarterly Max	1	Organic
515	23/08/2026	9819119229	Preyashi Roy	11,000	No	Annual Max	1	Organic
516	23/08/2026	9999390811	Prerak Bhavsar	4,500	No	Quarterly Max	1	Organic
517	23/08/2026	8920574984	Shubham Rai	11,000	No	Annual Max	1	Events
518	23/08/2026	7973209472	Rohit Jain	11,000	No	Annual Max	1	Organic
519	23/08/2026	6205625411	Abhijeet Mathur	4,500	No	Quarterly Max	1	Organic
520	23/08/2026	9959894462	Amol Landge	11,000	No	Annual Max	1	Events
521	23/08/2026	9568814044	Chhaya Patel	11,000	No	Annual Max	1	Organic
522	23/08/2026	9716242784	Vivek Shah	12,000	No	Annual Max	1	Organic
523	23/08/2026	9700146244	Amol Landge	11,000	No	Annual Max	1	Events
524	23/08/2026	9769313718	Rohit Jain	11,000	No	Annual Max	1	Organic
525	23/08/2026	8142811221	Amol Landge	11,000	No	Annual Max	1	Events
526	23/08/2026	7039310969	Rohit Jain	11,000	No	Annual Max	1	Organic
527	23/08/2026	8630897711	Prerak Bhavsar	2,700	No	Quarterly Plus	1	Organic
528	23/08/2026	9987755747	Vikas Poonia	10,376	No	Annual Max	1	Renewals
529	23/08/2026	9328290035	Tanveer Ahmed	3,500	Yes	Annual Max	0.5	Organic
530	23/08/2026	9328290035	Honey Talreja	7,500	Yes	Annual Max	0.5	Organic
531	23/08/2026	9328290035	Shikha Singh	11,000	No	Annual Max	1	Events
532	23/08/2026	7088971023	Yuvraj Singh Dodiya	11,000	No	Annual Max	1	Organic
533	23/08/2026	7838586510	Shikha Singh	11,000	No	Annual Max	1	Events
534	23/08/2026	9654299017	Shashank Tiwari	4,500	No	Quarterly Max	1	Organic
535	23/08/2026	9347981047	Amol Landge	11,000	No	Annual Max	1	Events
536	23/08/2026	7205794886	Jivesh Harde	11,000	No	Annual Max	1	Organic
537	23/08/2026	8008106108	Amol Landge	11,000	No	Annual Max	1	Events
538	23/08/2026	9664040928	Honey Talreja	12,000	No	Annual Max	1	Organic
539	23/08/2026	9619462864	Honey Talreja	12,000	No	Annual Max	1	Organic
540	24/08/2026	9974897626	Prerak Bhavsar	12,500	No	Annual Max	1	Organic
541	24/08/2026	8469935324	Kush Shah	11,000	No	Annual Max	1	Organic
542	24/08/2026	9032817512	Honey Talreja	5,000	No	Quarterly Max	1	Organic
543	24/08/2026	9738473711	Kush Shah	4,500	No	Annual Max	1	Organic
544	24/08/2026	9824240309	Honey Talreja	12,000	No	Annual Max	1	Organic
545	24/08/2026	7597219716	Vivek Shah	11,000	No	Annual Max	1	Organic
546	24/08/2026	9429132544	Sneha Anand	5,000	No	Quarterly Max	1	Organic
547	24/08/2026	9987853936	Vikas Poonia	10,376	No	Annual Max	1	Renewals
548	24/08/2026	9664352981	Vikas Poonia	7,000	No	Annual Plus	1	Renewals
549	24/08/2026	9987729592	Naveen Suwalka	4,500	No	Quarterly Max	1	Organic
550	24/08/2026	8851509452	Preyashi Roy	7,000	No	6 months Max	1	Organic
551	24/08/2026	8586858088	Chhaya Patel	11,000	No	Annual Max	1	Organic
552	24/08/2026	9010099993	Vivek Shah	11,000	No	Annual Max	1	Organic
553	24/08/2026	9898887768	Kush Shah	11,000	No	Annual Max	1	Organic`;

function parseDate(dateStr) {
  const parts = dateStr.trim().split('/');
  const a = parseInt(parts[0], 10);
  const b = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (a > 12) {
    return `${year}-08-${String(a).padStart(2, '0')}`;
  }
  if (b > 12) {
    return `${year}-08-${String(b).padStart(2, '0')}`;
  }
  if (a === 8) {
    return `${year}-08-${String(b).padStart(2, '0')}`;
  }
  return `${year}-08-${String(a).padStart(2, '0')}`;
}

const records = rawData.trim().split('\n').map(line => {
  const cols = line.split('\t');
  const revenue = parseInt(cols[4].trim().replace(/,/g, ''), 10);
  const count = parseFloat(cols[7].trim());
  return {
    date: parseDate(cols[1]),
    phone: cols[2].trim(),
    agent: cols[3].trim(),
    revenue: revenue,
    duplicate: cols[5].trim(),
    plan: cols[6].trim(),
    count: isNaN(count) ? 1 : count,
    source: cols[8] ? cols[8].trim() : 'Organic',
  };
});

const dailyMap = {};
records.forEach(r => {
  if (!dailyMap[r.date]) {
    dailyMap[r.date] = {
      date: r.date,
      totalRevenue: 0,
      salesCount: 0,
      transactions: 0,
      agents: {},
      plans: {},
      sources: {},
    };
  }
  const day = dailyMap[r.date];
  day.totalRevenue += r.revenue;
  day.salesCount += r.count;
  day.transactions += 1;

  if (!day.agents[r.agent]) day.agents[r.agent] = { revenue: 0, count: 0 };
  day.agents[r.agent].revenue += r.revenue;
  day.agents[r.agent].count += r.count;

  if (!day.plans[r.plan]) day.plans[r.plan] = { revenue: 0, count: 0 };
  day.plans[r.plan].revenue += r.revenue;
  day.plans[r.plan].count += r.count;

  if (!day.sources[r.source]) day.sources[r.source] = { revenue: 0, count: 0 };
  day.sources[r.source].revenue += r.revenue;
  day.sources[r.source].count += r.count;
});

const result = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

const outPath = path.join(__dirname, 'data', 'data.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');

console.log(`Successfully written ${result.length} days of data to ${outPath}`);
let totalRev = 0, totalSales = 0;
result.forEach(d => {
  totalRev += d.totalRevenue;
  totalSales += d.salesCount;
  console.log(`📅 ${d.date}: ₹${d.totalRevenue.toLocaleString('en-IN')} | Sales: ${d.salesCount} | Top Agent: ${Object.entries(d.agents).sort((a,b)=>b[1].revenue-a[1].revenue)[0][0]}`);
});
console.log(`\nGrand Total: ₹${totalRev.toLocaleString('en-IN')} across ${totalSales} sales.`);
