require 'rails_helper'

describe Api::CalculatorController do

  it "response to be 201 on post call after the user is authenticated" do
    user = User.create({:email => "k@s.com", :password => "kritikasaxena"})
    expect(user).to be_valid
    sign_in user
    post :create, :format => :json
    expect(response.status).to eq(201)
    expect(user.reload.calculator).to_not eq(nil) #for checking the user corresponding to one calculator
  end

  it "response to be 200 if calculator object exists for a user" do
    user = User.create({:email => "k@s.com", :password => "kritikasaxena"})
    expect(user).to be_valid
    sign_in user
    Calculator.create(:state=>0, :user=>user)
    put :update ,:command => "add 5", :format => :json
    expect(response.status).to eq(200)
    expect(user.reload.calculator).to_not eq(nil)
  end

  it "calculates properly after user is signed in" do
    user = User.create({:email => "k@s.com", :password => "kritikasaxena"})
    expect(user).to be_valid
    sign_in user
    Calculator.create(:state=>0, :user =>user)
    put :update ,:command => "add 5", :format => :json
    expect(response.status).to eq(200)
    expect(user.reload.calculator).to_not eq(nil)
    expect(response.body).to eq({ :state => 5.0}.to_json)
  end

  it "response to be 401(unauthorized user) for update without user sign-in" do
    user = User.create({:email => "k@s.com", :password => "kritikasaxena"})
    expect(user).to be_valid
    Calculator.create(:state=>0, :user=>user)
    put :update ,:command => "add 5", :format => :json
    expect(response.status).to eq(401)

  end

  it "responds 404 sign-in but calculator is not there" do
    user = User.create({:email => "k@s.com", :password => "kritikasaxena"})
    expect(user).to be_valid
    sign_in user
    put :update ,:command => "add 5", :format => :json
    expect(response.status).to eq(404)
    expect(user.reload.calculator).to eq(nil)
  end


end
